<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { supabase } from '@/lib/supabase';
import cookie from 'vue-cookies';
import { jwtDecode } from 'jwt-decode';
import AxiosInstance from '@/lib/axios/axiosInstance';
import Card from '@/components/Ui/Card.vue';

const token = cookie.get('token');
const decoded = token ? jwtDecode(token) : null;
const adminId = decoded?.id;

const contacts = ref([]);
const activeContact = ref(null);
const messages = ref([]);
const newMessage = ref("");
const messagesContainer = ref(null);
let subscription = null;

const fetchContacts = async () => {
    try {
        const res = await AxiosInstance.get('/chat/contacts');
        contacts.value = res.data.data;
    } catch (error) {
        console.error("Failed to fetch contacts", error);
    }
};

const selectContact = async (contact) => {
    activeContact.value = contact;
    try {
        const res = await AxiosInstance.get(`/chat/history/${contact.id_user}`);
        messages.value = res.data.data;
        scrollToBottom();
        setupRealtimeSubscription();
    } catch (error) {
        console.error("Failed to fetch history", error);
    }
};

const setupRealtimeSubscription = () => {
    // Unsubscribe from previous if exists
    if (subscription) {
        supabase.removeChannel(subscription);
    }

    if (!activeContact.value) return;

    subscription = supabase
        .channel('chat_messages_admin')
        .on(
            'postgres_changes',
            { 
                event: 'INSERT', 
                schema: 'public', 
                table: 'chat_messages' 
            },
            (payload) => {
                const msg = payload.new;
                // Check if this message belongs to the current conversation
                const isRelevant = (msg.sender_id === adminId && msg.receiver_id === activeContact.value.id_user) ||
                                   (msg.sender_id === activeContact.value.id_user && msg.receiver_id === adminId);
                
                if (isRelevant) {
                    messages.value.push(msg);
                    scrollToBottom();
                }
            }
        )
        .subscribe();
};

const sendMessage = async () => {
    if (!newMessage.value.trim() || !activeContact.value) return;
    
    const msgText = newMessage.value.trim();
    newMessage.value = ""; // optimistic clear

    try {
        // Option A: Send via API backend
        // This is better to ensure backend validation, timestamping, etc.
        await AxiosInstance.post('/chat/send', {
            receiver_id: activeContact.value.id_user,
            message: msgText
        });
        
        // We don't manually push to messages array here, 
        // the Supabase Realtime subscription will receive the INSERT and push it.
    } catch (error) {
        console.error("Failed to send message", error);
        newMessage.value = msgText; // restore on failure
    }
};

const scrollToBottom = () => {
    setTimeout(() => {
        if (messagesContainer.value) {
            messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
        }
    }, 100);
};

onMounted(() => {
    fetchContacts();
});

onUnmounted(() => {
    if (subscription) {
        supabase.removeChannel(subscription);
    }
});
</script>

<template>
    <div class="h-[calc(100vh-120px)] flex gap-4 bg-gray-50 rounded-xl">
        <!-- Sidebar Contacts -->
        <Card class="w-1/3 flex flex-col h-full bg-white shadow-sm border-r border-gray-100 p-0 overflow-hidden">
            <div class="p-4 border-b border-gray-100">
                <h2 class="text-lg font-semibold text-gray-800">Chat Panitia</h2>
                <input type="text" placeholder="Search..." class="mt-3 w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-shadow">
            </div>
            <div class="flex-1 overflow-y-auto">
                <div v-for="contact in contacts" :key="contact.id_user" 
                     @click="selectContact(contact)"
                     :class="['p-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors flex items-center gap-3', 
                             activeContact?.id_user === contact.id_user ? 'bg-brand-50 border-l-4 border-l-brand-500' : 'border-l-4 border-l-transparent']">
                    <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-400 to-brand-600 flex items-center justify-center text-white font-bold shrink-0 shadow-sm">
                        {{ contact.name.charAt(0).toUpperCase() }}
                    </div>
                    <div class="overflow-hidden">
                        <h3 class="font-semibold text-gray-800 truncate">{{ contact.name }}</h3>
                        <p class="text-xs text-gray-500 truncate">{{ contact.nama_instansi }}</p>
                    </div>
                </div>
            </div>
        </Card>

        <!-- Chat Area -->
        <Card class="w-2/3 flex flex-col h-full bg-white shadow-sm p-0 overflow-hidden">
            <template v-if="activeContact">
                <!-- Chat Header -->
                <div class="p-4 border-b border-gray-100 flex items-center gap-3 bg-white z-10 shadow-sm">
                    <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-400 to-brand-600 flex items-center justify-center text-white font-bold shrink-0 shadow-sm">
                        {{ activeContact.name.charAt(0).toUpperCase() }}
                    </div>
                    <div>
                        <h2 class="font-semibold text-gray-800">{{ activeContact.name }}</h2>
                        <p class="text-xs text-gray-500">{{ activeContact.nama_instansi }}</p>
                    </div>
                </div>

                <!-- Messages -->
                <div class="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50" ref="messagesContainer">
                    <div v-for="msg in messages" :key="msg.id_message" 
                         :class="['flex w-full', msg.sender_id === adminId ? 'justify-end' : 'justify-start']">
                        <div :class="['max-w-[70%] p-3 rounded-2xl shadow-sm text-sm', 
                                     msg.sender_id === adminId 
                                        ? 'bg-brand-500 text-white rounded-tr-sm' 
                                        : 'bg-white border border-gray-100 text-gray-800 rounded-tl-sm']">
                            <p class="whitespace-pre-wrap leading-relaxed">{{ msg.message }}</p>
                            <span :class="['text-[10px] block mt-1 opacity-70', msg.sender_id === adminId ? 'text-right' : 'text-left']">
                                {{ new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Input Area -->
                <div class="p-4 border-t border-gray-100 bg-white flex items-center gap-2">
                    <input type="text" v-model="newMessage" @keyup.enter="sendMessage" 
                           placeholder="Type a message..." 
                           class="flex-1 bg-gray-50 border border-gray-200 rounded-full px-5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-shadow">
                    <button @click="sendMessage" 
                            class="w-10 h-10 bg-brand-500 hover:bg-brand-600 active:scale-95 transition-all text-white rounded-full flex items-center justify-center shadow-md">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 ml-1">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                        </svg>
                    </button>
                </div>
            </template>
            <template v-else>
                <div class="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-50/30">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16 mb-4 opacity-20">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                    </svg>
                    <p class="font-medium text-gray-500">Select a chat to start messaging</p>
                </div>
            </template>
        </Card>
    </div>
</template>
