<template>
    <RouterView />
</template>

<script setup>
import { watch, onMounted } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

watch(() => store.state.settings.mode, () => {
    if (store.state.settings.mode === 'pc') {
        store.commit('settings/updateThemeSetting', {
            'sidebarCollapse': store.state.settings.sidebarCollapseLastStatus
        })
    } else if (store.state.settings.mode === 'mobile') {
        store.commit('settings/updateThemeSetting', {
            'sidebarCollapse': true
        })
    }
    document.body.setAttribute('data-mode', store.state.settings.mode)
}, {
    immediate: true
})

watch([
    () => store.state.settings.menuMode,
    () => store.state.settings.sidebarCollapse
], () => setMenuMode(), {
    immediate: true
})

watch([
    () => store.state.settings.enableDynamicTitle,
    () => store.state.settings.title
], () => setDocumentTitle(), {
    immediate: true
})

onMounted(() => {
    window.onresize = () => {
        store.commit('settings/setMode', document.documentElement.clientWidth)
    }
    window.onresize()
})

function setDocumentTitle() {
    if (store.state.settings.enableDynamicTitle && store.state.settings.title) {
        let title = store.state.settings.title
        document.title = `${title} - ${import.meta.env.VITE_APP_TITLE}`
    } else {
        // document.title = import.meta.env.VITE_APP_TITLE
        document.title = '赛默飞TFSDG简易版E-signing后台管理'
    }
}
function setMenuMode() {
    document.body.removeAttribute('data-sidebar-no-collapse')
    document.body.removeAttribute('data-sidebar-collapse')
    if (store.state.settings.sidebarCollapse) {
        document.body.setAttribute('data-sidebar-collapse', '')
    } else {
        document.body.setAttribute('data-sidebar-no-collapse', '')
    }
    document.body.setAttribute('data-menu-mode', store.state.settings.menuMode)
}
</script>
