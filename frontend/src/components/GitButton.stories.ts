import GifButton from './GifButton';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'GifButton',
  component: GifButton,
  tags: ['autodocs'],
} as Meta<typeof GifButton>;

export default meta;

type Story = StoryObj<typeof GifButton>;

export const Sample: Story = {
  args: {
    size: 'large',
    gifSrc: '/gif/miyabi_button.gif',
    beforeSrc: '/gif/miyabi_before.png',
    afterSrc: '/gif/miyabi_after.png',
    animationDuration: 1100,
    onClick: () => {
      console.log('clicked');
    },
  },
};
