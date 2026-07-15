<template>
  <div class="room-card glass hover-lift" @click="$emit('click')">

    <div class="room-top">

      <div class="room-icon">
        {{ icon }}
      </div>

      <ArrowRight
        :size="18"
        class="arrow"
      />

    </div>

    <h3 class="room-title">
      {{ title }}
    </h3>

    <p class="room-description">
      {{ description }}
    </p>

    <div class="room-footer">

      <div class="members">

        <Users :size="15" />

        <span>{{ members }} Members</span>

      </div>

      <span
        v-if="online"
        class="online"
      ></span>

    </div>

  </div>
</template>

<script setup>
import { Users, ArrowRight } from 'lucide-vue-next'

defineEmits(['click'])

defineProps({

  title:{
    type:String,
    required:true
  },

  description:{
    type:String,
    default:''
  },

  icon:{
    type:String,
    default:'💬'
  },

  members:{
    type:Number,
    default:0
  },

  online:{
    type:Boolean,
    default:true
  }

})
</script>

<style scoped>

.room-card{

    padding:22px;

    border-radius:22px;

    cursor:pointer;

    transition:all .35s ease;

    display:flex;

    flex-direction:column;

    gap:18px;

    min-height:180px;

}

.room-card:hover{

    transform:
        translateY(-6px);

    border-color:
        rgba(124,77,255,.45);

    box-shadow:
        0 18px 40px rgba(124,77,255,.25);

}

.room-top{

    display:flex;

    justify-content:space-between;

    align-items:center;

}

.room-icon{

    width:58px;

    height:58px;

    border-radius:18px;

    display:flex;

    justify-content:center;

    align-items:center;

    font-size:28px;

    background:var(--gradient-primary);

    box-shadow:var(--glow-primary);

}

.arrow{

    color:var(--text-secondary);

    transition:.3s;

}

.room-card:hover .arrow{

    transform:translateX(5px);

    color:white;

}

.room-title{

    margin:0;

    color:white;

    font-size:1.2rem;

    font-weight:700;

}

.room-description{

    margin:0;

    color:var(--text-secondary);

    line-height:1.5;

    flex:1;

}

.room-footer{

    display:flex;

    justify-content:space-between;

    align-items:center;

}

.members{

    display:flex;

    align-items:center;

    gap:8px;

    color:var(--text-secondary);

    font-size:.9rem;

}

</style>