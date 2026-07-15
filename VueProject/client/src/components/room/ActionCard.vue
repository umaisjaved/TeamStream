<template>
  <button
    class="action-card glass hover-lift"
    @click="$emit('click')"
  >

    <div class="action-icon">

      <component
        :is="icon"
        :size="24"
      />

    </div>

    <div class="action-content">

      <h3>{{ title }}</h3>

      <p>{{ subtitle }}</p>

    </div>

    <ArrowRight
      :size="20"
      class="arrow"
    />

  </button>
</template>

<script setup>
import { ArrowRight } from 'lucide-vue-next'

defineEmits(['click'])

defineProps({

  title:{
    type:String,
    required:true
  },

  subtitle:{
    type:String,
    default:''
  },

  icon:{
    type:Object,
    required:true
  }

})
</script>

<style scoped>

.action-card{

    width:100%;

    display:flex;

    align-items:center;

    gap:18px;

    padding:20px;

    border:none;

    border-radius:22px;

    cursor:pointer;

    text-align:left;

    transition:.35s;

}

.action-card:hover{

    border-color:rgba(124,77,255,.4);

    transform:translateY(-4px);

}

.action-icon{

    width:58px;

    height:58px;

    border-radius:18px;

    display:flex;

    justify-content:center;

    align-items:center;

    background:var(--gradient-primary);

    color:white;

    box-shadow:var(--glow-primary);

}

.action-content{

    flex:1;

}

.action-content h3{

    margin:0;

    color:white;

    font-size:1rem;

    font-weight:700;

}

.action-content p{

    margin-top:6px;

    color:var(--text-secondary);

    font-size:.88rem;

}

.arrow{

    color:var(--text-secondary);

    transition:.3s;

}

.action-card:hover .arrow{

    color:white;

    transform:translateX(6px);

}

</style>