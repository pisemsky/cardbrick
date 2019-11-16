<template>
  <div class="button" @click="$emit('click', $event)">{{ caption }}</div>
</template>

<script>
export default {
  name: 'GameButton',
  props: ['caption']
}
</script>

<style scoped>
.button {
  display: flex;
  align-items: center;
  justify-content: center;
  border: solid 1px gray;
  font-size: 1.5rem;
  cursor: pointer;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}
</style>
