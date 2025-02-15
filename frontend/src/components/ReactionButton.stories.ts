import ReactionButton from './ReactionButton';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'ReactionButton',
  component: ReactionButton,
  tags: ['autodocs'],
} as Meta<typeof ReactionButton>;

export default meta;

type Story = StoryObj<typeof ReactionButton>;

export const BubbleSample: Story = {
  args: {
    size: 'large',
    lottieSrc: '/lottie/bubble.lottie',
    onClick: () => {
      console.log('clicked');
    },
  },
};

export const WowSample: Story = {
  args: {
    size: 'large',
    lottieSrc: '/lottie/wow.lottie',
    onClick: () => {
      console.log('clicked');
    },
  },
};
