import { render, screen } from '@testing-library/react';
import { ActivityCard } from '@/components/activities/activity-card';

const mockActivity = {
  id: 'activity1',
  title: 'Swimming Lessons',
  description: 'Learn to swim with professional instructors',
  imageUrl: '/images/swimming.jpg',
  price: 5000,
  location: 'Porto',
  category: 'Sports',
  ageGroup: '6-12',
  rating: 4.5,
  totalReviews: 24,
  provider: {
    name: 'AquaCenter',
  },
  _count: {
    sessions: 8,
  },
};

describe('ActivityCard', () => {
  it('should render without crashing', () => {
    render(<ActivityCard activity={mockActivity} />);
    expect(screen.getByText('Swimming Lessons')).toBeInTheDocument();
  });

  it('should render basic activity information', () => {
    render(<ActivityCard activity={mockActivity} />);
    expect(screen.getByText('Swimming Lessons')).toBeInTheDocument();
    expect(screen.getByText('Learn to swim with professional instructors')).toBeInTheDocument();
    expect(screen.getByText('Sports')).toBeInTheDocument();
    expect(screen.getByText('Porto')).toBeInTheDocument();
    expect(screen.getByText('AquaCenter')).toBeInTheDocument();
  });

  it('should render image with alt text', () => {
    render(<ActivityCard activity={mockActivity} />);
    const image = screen.getByAltText('Swimming Lessons');
    expect(image).toBeInTheDocument();
  });
});