import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface ConfirmDialogOptions {
    title: string
    message: string
    confirmText?: string
    cancelText?: string
    confirmButtonClass?: string
    onConfirm?: () => void | Promise<void>
    onCancel?: () => void
}

export const useDialogStore = defineStore('dialog', () => {
    const showConfirm = ref(false)
    const confirmOptions = ref<ConfirmDialogOptions>({
        title: '',
        message: '',
        confirmText: '确定',
        cancelText: '取消',
        confirmButtonClass: 'btn-error'
    })

    const confirm = (options: ConfirmDialogOptions) => {
        confirmOptions.value = {
            ...confirmOptions.value,
            ...options
        }
        showConfirm.value = true
    }

    const closeConfirm = () => {
        showConfirm.value = false
    }

    return {
        showConfirm,
        confirmOptions,
        confirm,
        closeConfirm
    }
}) 