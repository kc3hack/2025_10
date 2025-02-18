import Loading from './Loading';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Loading',
  component: Loading,
  tags: ['autodocs'],
} as Meta<typeof Loading>;

export default meta;

type Story = StoryObj<typeof Loading>;

export const Sample: Story = {};
