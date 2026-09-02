<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { supabase } from '@/lib/supabase';
import cookie from 'vue-cookies';
import { jwtDecode } from 'jwt-decode';
import AxiosInstance from '@/lib/axios/axiosInstance';
import Card from '@/components/Ui/Card.vue';

const token = cookie.get('token');
const decoded = token ? jwtDecode(token) : null;
const panitiaId = decoded?.id;

// We use the known admin user ID 7 from the database
const adminId = 7; 
const adminName = "Admin Edvent";

const messages = ref([]);
const newMessage = ref("");
const messagesContainer = ref(null);
let subscription = null;

const fetchHistory = async () => {
    try {
        const res = await AxiosInstance.get(`/chat/history/${adminId}`);
        messages.value = res.data.data;
        scrollToBottom();
        setupRealtimeSubscription();
    } catch (error) {
        console.error("Failed to fetch history", error);
    }
};

const setupRealtimeSubscription = () => {
    if (subscription) {
        supabase.removeChannel(subscription);
    }

    subscription = supabase
        .channel('chat_messages_panitia')
        .on(
            'postgres_changes',
            { 
                event: 'INSERT', 
                schema: 'public', 
                table: 'chat_messages' 
            },
            (payload) => {
                const msg = payload.new;
                const isRelevant = (msg.sender_id === panitiaId && msg.receiver_id === adminId) ||
                                   (msg.sender_id === adminId && msg.receiver_id === panitiaId);
                
                if (isRelevant) {
                    messages.value.push(msg);
                    scrollToBottom();
                }
            }
        )
        .subscribe();
};

const sendMessage = async () => {
    if (!newMessage.value.trim()) return;
    
    const msgText = newMessage.value.trim();
    newMessage.value = ""; 

    try {
        await AxiosInstance.post('/chat/send', {
            receiver_id: adminId,
            message: msgText
        });
    } catch (error) {
        console.error("Failed to send message", error);
        newMessage.value = msgText;
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
    fetchHistory();
});

onUnmounted(() => {
    if (subscription) {
        supabase.removeChannel(subscription);
    }
});
</script>

<template>
    <div class="h-[calc(100vh-120px)] min-h-[480px] flex justify-center bg-transparent">
        <Card class="w-full max-w-3xl flex flex-col h-full bg-white shadow-sm border border-gray-100 p-0 rounded-xl overflow-hidden">
            <!-- Chat Header -->
            <div class="p-4 border-b border-gray-100 flex items-center gap-3 bg-white z-10 shadow-sm">
                <div class="w-12 h-12 rounded-full bg-gradient-to-tr from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold shrink-0 shadow-md">
                    A
                </div>
                <div>
                    <h2 class="font-bold text-gray-800 text-lg">{{ adminName }}</h2>
                    <p class="text-xs text-brand-500 font-medium bg-brand-50 inline-block px-2 py-0.5 rounded-full mt-0.5">Support Team</p>
                </div>
            </div>

            <!-- Messages -->
            <div class="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50/50" ref="messagesContainer">
                <div v-for="msg in messages" :key="msg.id_message" 
                     :class="['flex w-full', msg.sender_id === panitiaId ? 'justify-end' : 'justify-start']">
                    <div :class="['max-w-[75%] p-3.5 rounded-2xl shadow-sm text-[15px]', 
                                 msg.sender_id === panitiaId 
                                    ? 'bg-brand-500 text-white rounded-tr-sm' 
                                    : 'bg-white border border-gray-100 text-gray-800 rounded-tl-sm']">
                        <p class="whitespace-pre-wrap leading-relaxed">{{ msg.message }}</p>
                        <span :class="['text-[11px] block mt-1.5 opacity-70', msg.sender_id === panitiaId ? 'text-right text-brand-100' : 'text-left text-gray-400']">
                            {{ new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
                        </span>
                    </div>
                </div>
                <!-- Initial State / Empty -->
                <div v-if="messages.length === 0" class="flex flex-col items-center justify-center h-full text-gray-400 opacity-60">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16 mb-4">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                    </svg>
                    <p>Kirim pesan ke Admin sekarang</p>
                </div>
            </div>

            <!-- Input Area -->
            <div class="p-3 sm:p-4 border-t border-gray-100 bg-white flex items-center gap-2 sm:gap-3">
                <input type="text" v-model="newMessage" @keyup.enter="sendMessage" 
                       placeholder="Tulis pesan ke admin..." 
                       class="min-w-0 flex-1 bg-gray-50/50 border border-gray-200 rounded-full px-4 sm:px-5 py-3 text-sm sm:text-[15px] focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all">
                <button @click="sendMessage" 
                        class="w-12 h-12 bg-brand-500 hover:bg-brand-600 active:scale-95 transition-all text-white rounded-full flex items-center justify-center shadow-lg shadow-brand-500/30">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 ml-1">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                    </svg>
                </button>
            </div>
        </Card>
    </div>
</template>
