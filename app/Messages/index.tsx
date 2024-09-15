import React from 'react';
import MessageContainer from '@/components/Messages/MessageContainer';
import MessageChatBoxLayout from '@/components/layout/MessageLayout';
function MessagesScreen() {
    return (
        <>
            <MessageChatBoxLayout preventStatusBar={true}>
                <MessageContainer />
            </MessageChatBoxLayout>
        </>
    );
}
export default MessagesScreen;
