export const FetchUserAvatarByUrl = (url: string): Promise<string | undefined> => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch(url, {
                method: 'GET',
            });
            if (response.status === 200) {
                const blob = await response.blob();
                const fileReaderInstance = new FileReader();
                fileReaderInstance.onload = () => resolve((fileReaderInstance.result as string) ?? undefined);
                fileReaderInstance.onerror = (error) => reject(error);
                fileReaderInstance.readAsDataURL(blob);
            }
        } catch (error) {
            reject(error);
        }
    });
};
