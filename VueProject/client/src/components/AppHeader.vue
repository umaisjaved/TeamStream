<template>
  <header class="app-header glass">

    <div class="header-left">

      <button
        v-if="showBack"
        class="back-btn"
        @click="goBack"
      >
        <ArrowLeft :size="20" />
      </button>

      <div class="title-group">

        <h2 class="header-title">
          {{ title }}
        </h2>

        <p
          v-if="subtitle"
          class="header-subtitle"
        >
          {{ subtitle }}
        </p>

      </div>

    </div>

    <div class="header-right">
      <slot name="right" />
    </div>

  </header>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ArrowLeft } from 'lucide-vue-next'

const props = defineProps({

  title:{
    type:String,
    default:''
  },

  subtitle:{
    type:String,
    default:''
  },

  showBack:{
    type:Boolean,
    default:true
  },

  backTo:{
    type:String,
    default:''
  }

})

const router = useRouter()

function goBack(){

  if(props.backTo){

    router.push(props.backTo)

  }else{

    router.back()

  }

}
</script>

<style scoped>
.app-header{

    display:flex;

    justify-content:space-between;

    align-items:center;

    padding:18px 24px;

    border-radius:20px;

    margin-bottom:24px;

    box-shadow:var(--shadow-md);

}

.header-left{

    display:flex;

    align-items:center;

    gap:16px;

}

.back-btn{

    width:42px;

    height:42px;

    display:flex;

    justify-content:center;

    align-items:center;

    border:none;

    border-radius:50%;

    cursor:pointer;

    background:rgba(255,255,255,.06);

    color:white;

    transition:.3s;

}

.back-btn:hover{

    transform:translateX(-3px);

    background:var(--primary);

}

.title-group{

    display:flex;

    flex-direction:column;

}

.header-title{

    margin:0;

    color:white;

    font-size:1.35rem;

    font-weight:700;

}

.header-subtitle{

    margin-top:4px;

    color:var(--text-secondary);

    font-size:.85rem;

}

.header-right{

    display:flex;

    align-items:center;

    gap:12px;

}

@media(max-width:768px){

.app-header{

    padding:16px;

}

.header-title{

    font-size:1.1rem;

}

}
</style>