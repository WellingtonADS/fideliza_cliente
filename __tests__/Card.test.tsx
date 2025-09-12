import React from 'react';
import { render } from '@testing-library/react-native';
import Card from '../src/components/Card';
import { Text } from 'react-native';

describe('Card', () => {
  it('renderiza o conteúdo corretamente', () => {
    const { getByText } = render(
      <Card>
        <Text>Conteúdo do Card</Text>
      </Card>
    );
    expect(getByText('Conteúdo do Card')).toBeTruthy();
  });
});
