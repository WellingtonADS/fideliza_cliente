import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ActionButton from '../src/components/ActionButton';

describe('ActionButton', () => {
  it('renderiza o texto corretamente', () => {
    const { getByText } = render(
      <ActionButton title="Testar" onPress={() => {}} />
    );
    expect(getByText('Testar')).toBeTruthy();
  });

  it('executa onPress ao clicar', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <ActionButton title="Clique" onPress={onPressMock} />
    );
    fireEvent.press(getByText('Clique'));
    expect(onPressMock).toHaveBeenCalled();
  });
});
