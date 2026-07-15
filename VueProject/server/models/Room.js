const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    createdBy: {
      type: String,
      required: true,
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
    roomCode: {
      type: String,
      unique: true,
    },
    members: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

// Auto-generate room code
roomSchema.pre('save', function () {
  if (!this.roomCode) {
    this.roomCode = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();
  }
});

module.exports = mongoose.model('Room', roomSchema);