import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import ProfilePage from '../src/components/ProfilePage';
import { act, waitFor } from 'react-dom/test-utils';

describe('ProfilePage interactions', () => {
  it('allows the user to add a workout', () => {
    render(<ProfilePage />);
    fireEvent.click(screen.getByText(/Add workout/i));

    fireEvent.change(screen.getByPlaceholderText(/Name your workout!/i), { target: { value: 'New Workout' } });
    fireEvent.click(screen.getByText(/Save/i));

  });
});

describe('ProfilePage API interactions', () => {
  it('fetches user data on component mount', async () => {
    const mockUserData = { firstName: 'John', lastName: 'Doe', _id: '123' };
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockUserData),
    });

    await act(async () => {
      render(<ProfilePage />);
    });

    expect(fetch).toHaveBeenCalledWith('/user', expect.any(Object));
    expect(screen.getByText(/John Doe/)).toBeInTheDocument();
  });

  it('fetches personal records after user data is fetched', async () => {
    const mockRecords = [{ exerciseName: 'Squat', record: '250 LBS' }];
    global.fetch = jest.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ _id: '123' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockRecords),
      });

    await act(async () => {
      render(<ProfilePage />);
    });

    expect(fetch).toHaveBeenCalledWith('/personalRecord', expect.any(Object));
    expect(screen.getByText(/250 LBS/)).toBeInTheDocument();
  });
});


describe('ProfilePage user interactions', () => {
  it('allows user to change avatar', async () => {
    const file = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' });
    render(<ProfilePage />);
    
    const fileInput = screen.getByLabelText(/upload avatar/i);
    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(fileInput.files[0]).toBe(file);
    expect(fileInput.files).toHaveLength(1);
  });

  it('allows user to add a pal', async () => {
    const mockResponse = { message: 'Pal added successfully' };
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    render(<ProfilePage />);

    const addPalButton = screen.getByText(/Add Pal/i);
    fireEvent.click(addPalButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/user/addfriend/'), expect.any(Object));
      // Additional checks can be added here to verify the outcome
    });
  });

  it('handles adding a workout', async () => {
    const mockWorkout = { name: 'New Workout', exercises: [] };
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockWorkout),
    });

    render(<ProfilePage />);

    const addWorkoutButton = screen.getByText(/Add workout/i);
    fireEvent.click(addWorkoutButton);

    // simulate filling the form and submitting
    const input = screen.getByPlaceholderText(/Name your workout!/i);
    fireEvent.change(input, { target: { value: 'New Workout' } });
    const saveButton = screen.getByText(/Save/i);
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/profile/addtemplate', expect.any(Object));
      expect(input.value).toBe('New Workout');
      // Verify the workout list is updated if needed
    });
  });
});
