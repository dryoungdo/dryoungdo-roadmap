import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DebugPanel } from './DebugPanel';
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

describe('DebugPanel', () => {
  beforeEach(() => {
    // Reset store to clean state before each test
    useRoadmapStore.setState({
      departments: [],
      owners: [],
      items: [],
      feedbackItems: [],
      showForm: false,
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

  it('renders collapsed by default', () => {
    // Act
    render(<DebugPanel />);

    // Assert: Header visible, but details not visible
    expect(screen.getByText('Debug Panel')).toBeInTheDocument();

    // Table counts should not be visible when collapsed
    expect(screen.queryByText('Roadmap Items')).not.toBeInTheDocument();
    expect(screen.queryByText('Table Row Counts')).not.toBeInTheDocument();
  });

  it('expands when clicked', async () => {
    // Arrange
    const user = userEvent.setup();
    useRoadmapStore.setState({
      items: [],
      departments: [],
      owners: [],
      feedbackItems: [],
    });

    // Act
    render(<DebugPanel />);
    const headerButton = screen.getByRole('button', { name: /Debug Panel/ });
    await user.click(headerButton);

    // Assert: Details now visible (exact labels from lines 158, 168, 181, 188 in source)
    await waitFor(() => {
      expect(screen.getByText('Roadmap Items')).toBeInTheDocument();
    });
    expect(screen.getByText('Departments')).toBeInTheDocument();
    expect(screen.getByText('Owners')).toBeInTheDocument();
    expect(screen.getByText('Feedback')).toBeInTheDocument();
  });

  it('shows seed buttons when tables empty', async () => {
    // Arrange
    const user = userEvent.setup();
    useRoadmapStore.setState({
      departments: [],
      owners: [],
      items: [],
      feedbackItems: [],
    });

    // Act
    render(<DebugPanel />);
    const headerButton = screen.getByRole('button', { name: /Debug Panel/ });
    await user.click(headerButton);

    // Assert: Seed buttons visible
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Seed Default Departments/ })).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: /Seed Default Owners/ })).toBeInTheDocument();
  });

  it('hides seed buttons when tables have data', async () => {
    // Arrange
    const user = userEvent.setup();
    useRoadmapStore.setState({
      departments: [
        {
          key: 'clinical',
          nameTh: 'งานคลินิก',
          nameEn: 'Clinical',
          color: 'emerald',
          bgClass: 'bg-emerald-500',
          textClass: 'text-emerald-400',
          borderClass: 'border-emerald-500',
        },
      ],
      owners: [{ key: 'CEO', label: 'CEO' }],
      items: [],
      feedbackItems: [],
    });

    // Act
    render(<DebugPanel />);
    const headerButton = screen.getByRole('button', { name: /Debug Panel/ });
    await user.click(headerButton);

    // Assert: Seed buttons not visible
    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /Seed Default Departments/ })).not.toBeInTheDocument();
    });
    expect(screen.queryByRole('button', { name: /Seed Default Owners/ })).not.toBeInTheDocument();
  });

  it('shows correct table counts', async () => {
    // Arrange
    const user = userEvent.setup();
    useRoadmapStore.setState({
      items: [
        {
          id: '1',
          title: 'Item 1',
          department: 'clinical',
          owner: 'CEO',
          status: 'in_progress',
          priority: 'P1',
          startDate: '2026-01-01',
          endDate: '2026-03-31',
          progress: 50,
          milestones: [],
          dependencies: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          title: 'Item 2',
          department: 'marketing',
          owner: 'GM',
          status: 'planned',
          priority: 'P2',
          startDate: '2026-04-01',
          endDate: '2026-06-30',
          progress: 0,
          milestones: [],
          dependencies: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      departments: [
        {
          key: 'clinical',
          nameTh: 'งานคลินิก',
          nameEn: 'Clinical',
          color: 'emerald',
          bgClass: 'bg-emerald-500',
          textClass: 'text-emerald-400',
          borderClass: 'border-emerald-500',
        },
      ],
      owners: [
        { key: 'CEO', label: 'CEO' },
        { key: 'COO', label: 'COO' },
      ],
      feedbackItems: [
        {
          id: '1',
          user_id: 'user123',
          user_email: 'test@example.com',
          category: 'feature_request',
          title: 'Test feedback',
          description: 'Test description',
          priority: 'medium',
          status: 'new',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ],
    });

    // Act
    render(<DebugPanel />);
    const headerButton = screen.getByRole('button', { name: /Debug Panel/ });
    await user.click(headerButton);

    // Assert: Counts displayed correctly
    // The component shows label "Roadmap Items" with count "2" separately
    await waitFor(() => {
      expect(screen.getByText('Roadmap Items')).toBeInTheDocument();
    });
    expect(screen.getByText('Departments')).toBeInTheDocument();
    expect(screen.getByText('Owners')).toBeInTheDocument();
    expect(screen.getByText('Feedback')).toBeInTheDocument();

    // Check that counts are displayed (using getAllByText since multiple "2" may appear)
    const twoCounts = screen.getAllByText('2');
    expect(twoCounts.length).toBeGreaterThan(0); // Items: 2, Owners: 2
    const oneCount = screen.getAllByText('1');
    expect(oneCount.length).toBeGreaterThan(0); // Departments: 1, Feedback: 1
  });

  it('shows error when store has error', async () => {
    // Arrange
    const user = userEvent.setup();
    const errorMessage = 'FK constraint violation';
    useRoadmapStore.setState({
      error: errorMessage,
      departments: [],
      owners: [],
      items: [],
      feedbackItems: [],
    });

    // Act
    render(<DebugPanel />);
    const headerButton = screen.getByRole('button', { name: /Debug Panel/ });
    await user.click(headerButton);

    // Assert: Error visible
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: /Clear Error/ })).toBeInTheDocument();
  });

  it('reload button always present when expanded', async () => {
    // Arrange
    const user = userEvent.setup();
    useRoadmapStore.setState({
      departments: [],
      owners: [],
      items: [],
      feedbackItems: [],
    });

    // Act
    render(<DebugPanel />);
    const headerButton = screen.getByRole('button', { name: /Debug Panel/ });
    await user.click(headerButton);

    // Assert: Reload button visible
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Reload All Data/ })).toBeInTheDocument();
    });
  });

  it('clear error button clears error from store', async () => {
    // Arrange
    const user = userEvent.setup();
    useRoadmapStore.setState({
      error: 'Test error',
      departments: [],
      owners: [],
      items: [],
      feedbackItems: [],
    });

    // Act
    render(<DebugPanel />);
    const headerButton = screen.getByRole('button', { name: /Debug Panel/ });
    await user.click(headerButton);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Clear Error/ })).toBeInTheDocument();
    });

    const clearButton = screen.getByRole('button', { name: /Clear Error/ });
    await user.click(clearButton);

    // Assert: Error cleared
    const state = useRoadmapStore.getState();
    expect(state.error).toBeNull();
  });

  it('shows connection status when expanded', async () => {
    // Arrange
    const user = userEvent.setup();
    useRoadmapStore.setState({
      departments: [],
      owners: [],
      items: [],
      feedbackItems: [],
    });

    // Act
    render(<DebugPanel />);
    const headerButton = screen.getByRole('button', { name: /Debug Panel/ });
    await user.click(headerButton);

    // Assert: Connection status visible (exact text from line 123 in source)
    await waitFor(() => {
      expect(screen.getByText('Connection Status')).toBeInTheDocument();
    });
  });

  it('collapses when header clicked again', async () => {
    // Arrange
    const user = userEvent.setup();
    useRoadmapStore.setState({
      departments: [],
      owners: [],
      items: [],
      feedbackItems: [],
    });

    // Act
    render(<DebugPanel />);
    const headerButton = screen.getByRole('button', { name: /Debug Panel/ });

    // Expand
    await user.click(headerButton);
    await waitFor(() => {
      expect(screen.getByText('Roadmap Items')).toBeInTheDocument();
    });

    // Collapse
    await user.click(headerButton);

    // Assert: Details hidden again
    await waitFor(() => {
      expect(screen.queryByText('Roadmap Items')).not.toBeInTheDocument();
    });
  });
});
