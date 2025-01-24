<template>
    <dialog :class="{ 'modal modal-open': modelValue }" class="modal modal-bottom sm:modal-middle">
        <div class="modal-box">
            <h3 class="font-bold text-lg">{{ title }}</h3>
            <p class="py-4">{{ message }}</p>
            <div class="modal-action">
                <button class="btn" @click="handleCancel">{{ cancelText }}</button>
                <button :class="['btn', confirmButtonClass]" @click="handleConfirm">{{ confirmText }}</button>
            </div>
        </div>
        <form method="dialog" class="modal-backdrop">
            <button @click="handleCancel">关闭</button>
        </form>
    </dialog>
</template>

<script setup lang="ts">
const props = defineProps<{
    modelValue: boolean
    title: string
    message: string
    confirmText?: string
    cancelText?: string
    confirmButtonClass?: string
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
    (e: 'confirm'): void
    (e: 'cancel'): void
}>()

const handleConfirm = () => {
    emit('confirm')
    emit('update:modelValue', false)
}

const handleCancel = () => {
    emit('cancel')
    emit('update:modelValue', false)
}
</script> 