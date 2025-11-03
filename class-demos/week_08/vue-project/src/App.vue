<script setup>
import { ref } from 'vue'
const myVariable = ref('hi')

const greetings = () => {
  console.log('hello')
}
onMounted( () => {
  console.log('component mounted')
})
console.log(document.getElementByID('blue-paragraph'))

</script>

<template>
  <button @="greetings"> {{ myVariable }}</button>
  <p>
    text
  </p>
</template>

<style scoped>

</style>
