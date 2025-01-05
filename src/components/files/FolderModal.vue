<template>
    <dialog :class="{ 'modal modal-open': modelValue }" class="modal">
        <div class="modal-box">
            <h3 class="font-bold text-lg">新建文件夹</h3>
            <div class="py-4">
                <div class="form-control w-full">
                    <label class="label">
                        <span class="label-text">文件夹名称</span>
                    </label>
                    <input type="text" v-model="folderName" placeholder="输入文件夹名称" class="input input-bordered w-full" />
                </div>
            </div>
            <div class="modal-action">
                <button class="btn" @click="close">取消</button>
                <button class="btn btn-primary" @click="submit">确定</button>
            </div>
        </div>
        <form method="dialog" class="modal-backdrop">
            <button @click="close">关闭</button>
        </form>
    </dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
    modelValue: boolean
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
    (e: 'submit', name: string): void
}>()

const folderName = ref('')

const close = () => {
    emit('update:modelValue', false)
    folderName.value = ''
}

const submit = () => {
    if (folderName.value.trim()) {
        emit('submit', folderName.value.trim())
        close()
    }
}
</script>