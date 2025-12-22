<script setup>
import { UserCircleIcon, ChevronDownIcon, LogoutIcon, SettingsIcon, InfoCircleIcon } from "../../../Icons";
import { RouterLink } from "vue-router";
import { ref, onMounted, onUnmounted } from "vue";
import { useTaskStore } from "@/stores/Taskstore";
import cookie from "vue-cookies";
import { jwtDecode } from "jwt-decode";

const store = useTaskStore();

const dropdownOpen = ref(false);
const dropdownRef = ref(null);

const token = cookie?.get('token');
const decoded = token ? jwtDecode(token) : null;

const menuItems = [
    { href: "#", icon: UserCircleIcon, text: "Edit profile" },
    { href: decoded?.role.toUpperCase() === 'BD' || decoded?.role.toUpperCase() === 'MANAGER OPERASIONAL' ? '/settings' : '#', icon: SettingsIcon, text: "Account settings" },
    { href: "#", icon: InfoCircleIcon, text: "Support" },
];

const toggleDropdown = () => {
    dropdownOpen.value = !dropdownOpen.value;
};

const closeDropdown = () => {
    dropdownOpen.value = false;
};

const signOut = async () => {
    cookie.remove('token');
    await store.logout();
    closeDropdown();
};

const handleClickOutside = (event) => {
    if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
        closeDropdown();
    }
};

onMounted(() => {
    document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
    document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
    <div class="relative" ref="dropdownRef">
        <button class="flex items-center text-gray-700 dark:text-gray-400" @click.prevent="toggleDropdown">
            <span class="mr-3 overflow-hidden rounded-full h-9 w-9">
                <img src="/avatar.jpg" alt="User" />
            </span>

            <span class="block mr-1 font-medium text-theme-sm">{{ decoded?.name }}</span>

            <ChevronDownIcon :class="{ 'rotate-180': dropdownOpen }" />
        </button>

        <!-- Dropdown Start -->
        <div v-if="dropdownOpen" class="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark lg:right-0 md:right-0">

            <ul class="flex flex-col gap-1 pt-2 pb-3 border-b border-gray-200 dark:border-gray-800">
                <li v-for="item in menuItems" :key="item.href">
                    <router-link
                        :to="item.href"
                        class="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                    >
                        <!-- SVG icon would go here -->
                        <component :is="item.icon" class="text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300" />
                        {{ item.text }}
                    </router-link>
                </li>
            </ul>
            <router-link
                to="/login"
                @click="signOut"
                class="flex items-center gap-3 px-3 py-2 mt-3 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
                <LogoutIcon class="text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300" />
                Sign out
            </router-link>
        </div>
        <!-- Dropdown End -->
    </div>
</template>
