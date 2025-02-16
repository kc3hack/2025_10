import Dialog from './Dialog';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Dialog',
  component: Dialog,
  tags: ['autodocs'],
} as Meta<typeof Dialog>;

export default meta;

type Story = StoryObj<typeof Dialog>;

export const Sample: Story = {
  args: {
    isOpen: true,
    title: 'タイトル',
    description: '説明',
    isOnlyOK: false,
    yesCallback: () => {
      console.log('Yes clicked');
    },
    noCallback: () => {
      console.log('No clicked');
    },
    yesText: 'はい',
    noText: 'いいえ',
  },
};
