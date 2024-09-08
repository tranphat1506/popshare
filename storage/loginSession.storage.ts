import { SECRET_KEY_ASYNC_STORAGE } from '@/constants/Constants';
import { logout } from '@/redux/auth/reducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CryptoJS from 'crypto-js';
// Interface representing a session token for a user
export interface ISessionToken {
    userId: string; // The user's unique identifier
    username: string; // The username associated with the session
    displayName: string;
    authId: string; // The authentication ID (used as the key in the sessions object)
    avatarEmoji: string; // An emoji representing the user's avatar
    avatarColor: string; // The color associated with the user's avatar
    profilePicture: string | undefined; // The URL to the user's profile picture (optional)
    rtoken?: string; // The refresh token (optional)
    token: string;
}

// Interface representing the saved login sessions
export interface ILoginSessionSaved {
    sessions: { [authId: string]: ISessionToken }; // Object storing sessions, keyed by authId
    current?: ISessionToken; // current user login
}

// Class managing the storage and retrieval of login sessions
export class LoginSessionManager {
    private static SECRET_KEY = SECRET_KEY_ASYNC_STORAGE; // The encryption key for securing session data

    /*
     * Initializes the storage with an empty sessions object.
     * Encrypts the data and saves it to AsyncStorage.
     */
    private static async createLoginSessionSaved(): Promise<void> {
        try {
            const saved: ILoginSessionSaved = { sessions: {} };
            const encrypted = CryptoJS.AES.encrypt(JSON.stringify(saved), LoginSessionManager.SECRET_KEY).toString();
            await AsyncStorage.setItem('loginSaved', encrypted);
        } catch (error) {
            console.error('Error creating login session saved:', error);
        }
    }

    /*
     * Retrieves and decrypts the stored login session data.
     * If no data exists, initializes the storage and retrieves it again.
     */
    public static async getLoginSessionSaved(): Promise<ILoginSessionSaved> {
        try {
            const stringData = await AsyncStorage.getItem('loginSaved');
            if (!stringData) {
                await LoginSessionManager.createLoginSessionSaved();
                return await LoginSessionManager.getLoginSessionSaved();
            }
            const decrypted = CryptoJS.AES.decrypt(stringData, LoginSessionManager.SECRET_KEY).toString(
                CryptoJS.enc.Utf8,
            );
            const savedList: ILoginSessionSaved = JSON.parse(decrypted);
            return savedList;
        } catch (error) {
            console.error('Error getting login session saved:', error);
            return { sessions: {} }; // Return an empty object in case of error
        }
    }

    /*
     * Encrypts and saves the provided session data to AsyncStorage.
     */
    public static async saveLoginSessionSaved(saved: ILoginSessionSaved): Promise<void> {
        try {
            const encrypted = CryptoJS.AES.encrypt(JSON.stringify(saved), LoginSessionManager.SECRET_KEY).toString();
            await AsyncStorage.setItem('loginSaved', encrypted);
        } catch (error) {
            console.error('Error saving login session saved:', error);
        }
    }

    /*
     * Adds a new session to the saved sessions.
     * Only saves the session if the refresh token (rToken) is provided.
     * Returns a boolean indicating success or failure.
     */
    public static async setSessionToSessionSaved(session: ISessionToken, setCurrent?: boolean): Promise<boolean> {
        try {
            if (!session.rtoken) return false;
            const savedList = await LoginSessionManager.getLoginSessionSaved();
            savedList.sessions[session.userId] = session; // Use userId as the key
            if (setCurrent) savedList.current = session;
            await LoginSessionManager.saveLoginSessionSaved(savedList);
            return true;
        } catch (error) {
            console.error('Error setting session to session saved:', error);
            return false;
        }
    }

    /*
     * Retrieves a session by its userId.
     * Returns the session if found, otherwise returns null.
     */
    public static async getSessionByUserId(userId: string): Promise<ISessionToken | null> {
        try {
            const savedList = await LoginSessionManager.getLoginSessionSaved();
            return savedList.sessions[userId] || null;
        } catch (error) {
            console.error('Error getting session by userId:', error);
            return null;
        }
    }

    public static async getCurrentSession(): Promise<ISessionToken | null> {
        try {
            const savedList = await LoginSessionManager.getLoginSessionSaved();
            if (!savedList.current) return null;
            return savedList.current;
        } catch (error) {
            console.error('Error getting current session:', error);
            return null;
        }
    }

    public static async setCurrentSession(session?: ISessionToken): Promise<void> {
        try {
            const savedList = await LoginSessionManager.getLoginSessionSaved();
            savedList.current = session;
            await LoginSessionManager.saveLoginSessionSaved(savedList);
        } catch (error) {
            console.error('Error setting current session:', error);
        }
    }

    public static async logoutSession(removeSaved?: boolean) {
        try {
            const savedList = await LoginSessionManager.getLoginSessionSaved();
            if (removeSaved && savedList.current) delete savedList.sessions[savedList.current.userId];
            savedList.current = undefined;
            await LoginSessionManager.saveLoginSessionSaved(savedList);
        } catch (error) {
            console.error('Error logout current session:', error);
        }
    }
}
