<template>
  <div>
    <div
      class="tag is-warning"
      v-if="status === 'loading'"
    >
      <span class="icon">
        <FontAwesomeIcon
          icon="spinner"
          class="fa-spin"
        />
      </span>
      <span>Loading</span>
    </div>
    <div
      class="tag is-danger"
      v-if="status === 'error'"
    >
      <span class="icon">
        <FontAwesomeIcon icon="circle-xmark" />
      </span>
      <span>Error</span>
    </div>
    <div
      class="tag is-success"
      v-if="status === 'ok'"
    >
      <span class="icon">
        <FontAwesomeIcon icon="circle-check" />
      </span>
    </div>
  </div>
</template>

<script setup>
import {watch} from "vue";
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'

const props = defineProps({
  status: {type: String, default: ''}
})
watch(()=>props.status, s=>console.log('status', s))
</script>

