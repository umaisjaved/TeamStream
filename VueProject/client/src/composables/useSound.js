export function useSound() {

  function playMessageSound() {
    try {
      const context = new (window.AudioContext || window.webkitAudioContext)()
      const oscillator = context.createOscillator()
      const gainNode = context.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(context.destination)

      oscillator.type = 'sine'
      oscillator.frequency.setValueAtTime(587, context.currentTime)
      oscillator.frequency.setValueAtTime(784, context.currentTime + 0.1)

      gainNode.gain.setValueAtTime(0.3, context.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.4)

      oscillator.start(context.currentTime)
      oscillator.stop(context.currentTime + 0.4)
    } catch (err) {
      console.log('Sound not supported:', err)
    }
  }

  function playPrivateMessageSound() {
    try {
      const context = new (window.AudioContext || window.webkitAudioContext)()
      const oscillator = context.createOscillator()
      const gainNode = context.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(context.destination)

      oscillator.type = 'sine'
      oscillator.frequency.setValueAtTime(880, context.currentTime)
      oscillator.frequency.setValueAtTime(1100, context.currentTime + 0.1)
      oscillator.frequency.setValueAtTime(880, context.currentTime + 0.2)

      gainNode.gain.setValueAtTime(0.3, context.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.5)

      oscillator.start(context.currentTime)
      oscillator.stop(context.currentTime + 0.5)
    } catch (err) {
      console.log('Sound not supported:', err)
    }
  }

  function playJoinSound() {
    try {
      const context = new (window.AudioContext || window.webkitAudioContext)()
      const oscillator = context.createOscillator()
      const gainNode = context.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(context.destination)

      oscillator.type = 'sine'
      oscillator.frequency.setValueAtTime(440, context.currentTime)
      oscillator.frequency.setValueAtTime(550, context.currentTime + 0.15)

      gainNode.gain.setValueAtTime(0.2, context.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.3)

      oscillator.start(context.currentTime)
      oscillator.stop(context.currentTime + 0.3)
    } catch (err) {
      console.log('Sound not supported:', err)
    }
  }

  return { playMessageSound, playPrivateMessageSound, playJoinSound }
}