<template>
  <dl>
    <template v-for="(value, name, index) in mapping">
      <dt :key="index + '-name'">{{ name }}</dt>
      <dd :key="index + '-value'">{{ value }}</dd>
    </template>
  </dl>
</template>

<script>
export default {
  name: 'GameStatus',
  props: ['mapping']
}
</script>

<style scoped>
dl {
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin: 0;
  font-size: 1.5rem;
}

dt {
  grid-column: 1;
}

dd {
  grid-column: 2;
  text-align: right;
  margin-left: 0;
  color: red;
}
</style>
