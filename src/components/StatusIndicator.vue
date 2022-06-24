<template>
  <div>
    <div
      v-if="status === 'loading'"
      class="tag is-warning"
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
      v-if="status === 'error'"
      class="tag is-danger"
    >
      <span class="icon">
        <FontAwesomeIcon icon="circle-xmark" />
      </span>
      <span>Error</span>
    </div>
    <div
      v-if="status === 'ok'"
      class="tag is-success"
    >
      <span class="icon">
        <FontAwesomeIcon icon="circle-check" />
      </span>
    </div>
  </div>
</template>

<script setup>
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'

defineProps({
  status: {type: String, default: ''}
})
</script>

