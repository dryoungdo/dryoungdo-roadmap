import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ItemFormModal } from './ItemFormModal';
import { useRoadmapStore } from '../../store/useRoadmapStore';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock supabase
vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({ count: 'exact', head: true })).mockResolvedValue({ error: null }),
    })),
    auth: { signOut: vi.fn() },
  },
}));

// Mock supabase-sync
vi.mock('../../lib/supabase-sync', () => ({
  initializeData: vi.fn().mockResolvedValue(undefined),
  subscribeToChanges: vi.fn(),
  unsubscribeFromChanges: vi.fn(),
}));

describe('ItemFormModal', () => {
  beforeEach(() => {
    // Reset store to clean state before each test
    useRoadmapStore.setState({
      departments: [],
      owners: [],
      items: [],
      feedbackItems: [],
      showForm: true,
      editingItem: null,
      error: null,
      filters: {
        departments: [],
        priorities: [],
        statuses: [],
        owner: 'all',
        search: '',
      },
    });
  });

  it('shows warning when no departments or owners configured', () => {
    // Arrange: Empty departments and owners
    useRoadmapStore.setState({
      departments: [],
      owners: [],
      showForm: true,
    });

    // Act
    render(<ItemFormModal />);

    // Assert: Warning message visible (exact Thai text from line 120 in source)
    expect(screen.getByText(/กรุณาเพิ่มแผนกและเจ้าของในหน้าตั้งค่าก่อน/)).toBeInTheDocument();

    // Submit button should be disabled
    const submitButton = screen.getByRole('button', { name: /บันทึก/ });
    expect(submitButton).toBeDisabled();
  });

  it('shows no warning when departments and owners exist', () => {
    // Arrange: Valid configuration
    useRoadmapStore.setState({
      departments: [
        {
          key: 'clinical',
          nameTh: 'งานคลินิก',
          nameEn: 'Clinical',
          color: 'cyan',
          bgClass: 'bg-cyan-500',
          textClass: 'text-cyan-400',
          borderClass: 'border-cyan-500',
        },
      ],
      owners: [{ key: 'CEO', label: 'CEO' }],
      showForm: true,
    });

    // Act
    render(<ItemFormModal />);

    // Assert: No warning message
    expect(screen.queryByText(/กรุณาเพิ่มแผนกและเจ้าของในหน้าตั้งค่าก่อน/)).not.toBeInTheDocument();

    // Submit button should be enabled
    const submitButton = screen.getByRole('button', { name: /บันทึก/ });
    expect(submitButton).not.toBeDisabled();
  });

  it('department select shows available departments', () => {
    // Arrange: Multiple departments
    useRoadmapStore.setState({
      departments: [
        {
          key: 'clinical',
          nameTh: 'งานคลินิก',
          nameEn: 'Clinical',
          color: 'cyan',
          bgClass: 'bg-cyan-500',
          textClass: 'text-cyan-400',
          borderClass: 'border-cyan-500',
        },
        {
          key: 'marketing',
          nameTh: 'การตลาด',
          nameEn: 'Marketing',
          color: 'purple',
          bgClass: 'bg-purple-500',
          textClass: 'text-purple-400',
          borderClass: 'border-purple-500',
        },
      ],
      owners: [{ key: 'CEO', label: 'CEO' }],
      showForm: true,
    });

    // Act
    render(<ItemFormModal />);

    // Assert: Department select has both options (shows Thai names)
    // Select element doesn't have proper label association, so query by role
    const departmentSelects = screen.getAllByRole('combobox');
    const departmentSelect = departmentSelects[0]; // First combobox is department
    const options = departmentSelect.querySelectorAll('option');
    expect(options).toHaveLength(2);
    expect(options[0]).toHaveTextContent('งานคลินิก');
    expect(options[1]).toHaveTextContent('การตลาด');
  });

  it('owner buttons render for available owners', async () => {
    // Arrange: Multiple owners
    const user = userEvent.setup();
    useRoadmapStore.setState({
      departments: [
        {
          key: 'clinical',
          nameTh: 'งานคลินิก',
          nameEn: 'Clinical',
          color: 'cyan',
          bgClass: 'bg-cyan-500',
          textClass: 'text-cyan-400',
          borderClass: 'border-cyan-500',
        },
      ],
      owners: [
        { key: 'CEO', label: 'CEO' },
        { key: 'COO', label: 'COO' },
      ],
      showForm: true,
    });

    // Act
    render(<ItemFormModal />);

    // Assert: Both owner buttons visible
    const ceoButton = screen.getByRole('button', { name: 'CEO' });
    const cooButton = screen.getByRole('button', { name: 'COO' });
    expect(ceoButton).toBeInTheDocument();
    expect(cooButton).toBeInTheDocument();

    // Verify they're clickable
    await user.click(cooButton);
    expect(cooButton).toBeInTheDocument();
  });

  it('shows "no owners configured" message when owners empty', () => {
    // Arrange: Has departments but no owners
    useRoadmapStore.setState({
      departments: [
        {
          key: 'clinical',
          nameTh: 'งานคลินิก',
          nameEn: 'Clinical',
          color: 'cyan',
          bgClass: 'bg-cyan-500',
          textClass: 'text-cyan-400',
          borderClass: 'border-cyan-500',
        },
      ],
      owners: [],
      showForm: true,
    });

    // Act
    render(<ItemFormModal />);

    // Assert: No owners message visible (exact Thai text from line 232 in source)
    expect(screen.getByText(/ไม่มีเจ้าของที่กำหนดไว้/)).toBeInTheDocument();
  });

  it('submit button disabled when config empty', () => {
    // Arrange: Completely empty configuration
    useRoadmapStore.setState({
      departments: [],
      owners: [],
      showForm: true,
    });

    // Act
    render(<ItemFormModal />);

    // Assert: Submit button disabled (text is "บันทึก" from line 392 in source)
    const submitButton = screen.getByRole('button', { name: /บันทึก/ });
    expect(submitButton).toBeDisabled();
  });

  it('renders form fields when properly configured', () => {
    // Arrange: Valid configuration
    useRoadmapStore.setState({
      departments: [
        {
          key: 'clinical',
          nameTh: 'งานคลินิก',
          nameEn: 'Clinical',
          color: 'cyan',
          bgClass: 'bg-cyan-500',
          textClass: 'text-cyan-400',
          borderClass: 'border-cyan-500',
        },
      ],
      owners: [{ key: 'CEO', label: 'CEO' }],
      showForm: true,
    });

    // Act
    render(<ItemFormModal />);

    // Assert: All form fields present
    const comboboxes = screen.getAllByRole('combobox');
    expect(comboboxes.length).toBeGreaterThan(0); // Department and status selects
    expect(screen.getByRole('button', { name: 'CEO' })).toBeInTheDocument(); // Owner button
    expect(screen.getByPlaceholderText(/เช่น เปิดสาขาใหม่ที่เชียงใหม่/)).toBeInTheDocument(); // Title input (actual placeholder from line 137)
    expect(screen.getByRole('button', { name: /บันทึก/ })).toBeInTheDocument(); // Submit button
    expect(screen.getByRole('button', { name: /ยกเลิก/ })).toBeInTheDocument(); // Cancel button
  });

  it('cancel button closes the modal', async () => {
    // Arrange
    const user = userEvent.setup();
    useRoadmapStore.setState({
      departments: [
        {
          key: 'clinical',
          nameTh: 'งานคลินิก',
          nameEn: 'Clinical',
          color: 'cyan',
          bgClass: 'bg-cyan-500',
          textClass: 'text-cyan-400',
          borderClass: 'border-cyan-500',
        },
      ],
      owners: [{ key: 'CEO', label: 'CEO' }],
      showForm: true,
    });

    // Act
    render(<ItemFormModal />);
    const cancelButton = screen.getByRole('button', { name: /ยกเลิก/ });
    await user.click(cancelButton);

    // Assert: Store's showForm should be false
    const state = useRoadmapStore.getState();
    expect(state.showForm).toBe(false);
  });
});
