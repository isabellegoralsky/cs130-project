import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProfilePage from '../src/components/ProfilePage';

describe('ProfilePage', () => {
    test('renders exercise input fields', () => {
        render(<ProfilePage />);
        const exerciseInputs = screen.getAllByRole('combobox');
        expect(exerciseInputs.length).toBeGreaterThan(0);
    });

    test('updates exercise state on input change', () => {
        render(<ProfilePage />);
        
        const exerciseInput = screen.getByRole('combobox');
        
        fireEvent.change(exerciseInput, { target: { value: 'Squat' } });
        
        expect(exerciseInput.value).toBe('Squat');
    });
    
test('check changing tab to following', () => {
    render(<ProfilePage />);
    const followingTab = screen.getByText('Following');
    fireEvent.click(followingTab);
    expect(screen.getByText('Following')).toBeInTheDocument();
});

});
