<template>
  <div class="dialog-overlay" @click.self="$emit('cancel')">
    <div class="dialog-box">
      <h3>{{ title }}</h3>
      <p>{{ message }}</p>
      <div class="dialog-actions">
        <button class="btn-cancel" @click="$emit('cancel')">
          {{ cancelText }}
        </button>
        <button class="btn-confirm" @click="$emit('confirm')">
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, default: 'Confirm' },
  message: { type: String, default: 'Are you sure?' },
  confirmText: { type: String, default: 'Yes' },
  cancelText: { type: String, default: 'Cancel' }
})

defineEmits(['confirm', 'cancel'])
</script>

<style scoped>
.dialog-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.dialog-box {
  background: #16213e;
  border-radius: 12px;
  padding: 30px;
  width: 320px;
  border: 1px solid #333;
  color: white;
}
.dialog-box h3 {
  margin: 0 0 10px;
  font-size: 1.2rem;
}
.dialog-box p {
  color: #aaa;
  margin: 0 0 24px;
}
.dialog-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}
.btn-cancel {
  padding: 10px 20px;
  border-radius: 8px;
  border: 1px solid #333;
  background: transparent;
  color: #aaa;
  cursor: pointer;
}
.btn-confirm {
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  background: #e94560;
  color: white;
  cursor: pointer;
}
.btn-cancel:hover { background: #0f3460; color: white; }
.btn-confirm:hover { opacity: 0.85; }
</style>