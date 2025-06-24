import React, {useState} from 'react';
import './SideBar.css';
import {useDeleteConversation, useGetConversations} from "../../hooks/conversationsHook";
import {ReactComponent as NewChatIcon} from '../../../src/assets/icons/chat-add.svg';
import {ReactComponent as OptionsIcon} from '../../../src/assets/icons/options.svg';
import {ReactComponent as DeleteIcon} from '../../../src/assets/icons/delete.svg';
import {ReactComponent as QuestionFrameIcon} from '../../../src/assets/icons/question-frame.svg';
import {Button, Divider, IconButton, Menu, Tooltip} from "@mui/material";

const SideBar = ({ onConversationClick, onNewChatClick, onDeleteConversationClick  }) => {
    const { data: conversations, isLoading, isError } = useGetConversations();
    const { mutateAsync: deleteConversationAsync } = useDeleteConversation();
    const [menuState, setMenuState] = useState({});
    const [activeConversationId, setActiveConversationId] = useState(null);

    const handleConversationClick = (conversation) => {
        setActiveConversationId(conversation.id);
        onConversationClick(conversation);
    };

    const handleNewChatClick = () => {
        setActiveConversationId(null);
        onNewChatClick();
    }

    const handleClickShowMenu = (event, conversationId) => {
        event.stopPropagation();
        setMenuState((prev) => ({
          ...prev,
          [conversationId]: event.currentTarget,
        }));
      };

    const handleCloseMenu = (conversationId) => {
        setMenuState((prev) => ({
          ...prev,
          [conversationId]: null,
        }));
      };

    const handleDeleteConversation = async (conversationId) => {
        handleCloseMenu();
        try {
            await deleteConversationAsync({id: conversationId})
            onDeleteConversationClick();
        } catch (e) {
            console.error("Cannot delete conversation", e);
        }
    }

    if (isLoading) {
        return (
            <div className="sidebar-container">
                <div className="sidebar-header">
                    <h5 className="sidebar-header-text sidebar-header-text__loading">Loading...</h5>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="sidebar-container">
                <div className="sidebar-header">
                    <h5 className="sidebar-header-text">
                        <div>Error loading conversations.</div>
                    </h5>
                </div>
            </div>
        )
    }

    return (
        <div className="sidebar-container">
            <div className="sidebar-header">
                <h2 className="sidebar-header-text">Conversations</h2>
                <Tooltip title="New chat" arrow>
                    <IconButton onClick={handleNewChatClick}>
                        <NewChatIcon style={{ width: 28, height: 28 }} />
                    </IconButton>
                </Tooltip>
            </div>
            <Divider />
            <div className="conversation-list-container">
                <ul className="conversation-list">
                    {conversations.data.length === 0 && (
                        <div className="no-conversations-notificaton notify notify-info">
                            Conversations are not persisted. Start a new chat to create a conversation.
                        </div>
                    )}
                    {conversations.data.length > 0 && conversations.data.map((conversation) => (
                        <li 
                            id={conversation.id} 
                            key={conversation.id} 
                            onClick={() => handleConversationClick(conversation)}
                            className={`conversation-item ${activeConversationId === conversation.id ? 'active' : ''}`}
                        >
                            <div className="conversation-item__title">{conversation.title}</div>
                            <Tooltip title={"Options"} arrow placement="top">
                                <IconButton className="option-button" onClick={(e) => handleClickShowMenu(e, conversation.id)}>
                                    <OptionsIcon style={{width: 20, height: 20}}/>
                                </IconButton>
                            </Tooltip>
                            <Menu
                                className="options-menu"
                                id={`menu-${conversation.id}`}
                                anchorEl={menuState[conversation.id]}
                                open={Boolean(menuState[conversation.id])}
                                onClose={() => handleCloseMenu(conversation.id)}
                                MenuListProps={{
                                    'aria-labelledby': `button-${conversation.id}`,
                                }}
                            >
                                <Button
                                    onClick={() => handleDeleteConversation(conversation.id)}
                                    startIcon={<DeleteIcon className="delete-conversation-icon" style={{width: 20, height: 20}}/>}
                                    className="menu-item-action-button"
                                    color="error"
                                >
                                    <span className="menu-item-action-button__text">Delete</span>
                                </Button>
                            </Menu>
                        </li>
                    ))}
                </ul>
                <div className="documentation-link">
                    <Button
                        startIcon={<QuestionFrameIcon className="question-icon" style={{ width: 20, height: 20 }} />}
                        className="documentation-button"
                        color="primary"
                        onClick={() => {}}
                    >
                        <span className="documentation-button-text">Documentation</span>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default SideBar;