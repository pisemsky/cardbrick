<template>
  <div class="message">{{ message }}</div>
</template>

<script>
export default {
  name: 'GameMessage',
  props: ['message']
}
</script>

<style scoped>
.message {
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  border: solid 1px #f2f200;
  border-radius: 24px;
  background-color: #ffff00;
  font-size: 24px;
}
</style>
