import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from '@/components/ui/input';

describe('Input', () => {
  it('should render input', () => {
    render(<Input placeholder="Test input" />);
    expect(screen.getByPlaceholderText('Test input')).toBeInTheDocument();
  });

  it('should handle value changes', () => {
    const handleChange = jest.fn();
    render(<Input onChange={handleChange} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test value' } });
    
    expect(handleChange).toHaveBeenCalled();
  });

  it('should apply default classes', () => {
    render(<Input placeholder="Test input" />);
    const input = screen.getByPlaceholderText('Test input');
    expect(input).toHaveClass('border');
    expect(input).toHaveClass('rounded-md');
    expect(input).toHaveClass('px-3');
    expect(input).toHaveClass('py-2');
  });

  it('should handle disabled state', () => {
    render(<Input disabled placeholder="Disabled input" />);
    const input = screen.getByPlaceholderText('Disabled input');
    expect(input).toBeDisabled();
  });

  it('should handle different input types', () => {
    render(<Input type="email" placeholder="Email input" />);
    const input = screen.getByPlaceholderText('Email input');
    expect(input).toHaveAttribute('type', 'email');
  });

  it('should accept custom className', () => {
    render(<Input className="custom-input" placeholder="Custom input" />);
    const input = screen.getByPlaceholderText('Custom input');
    expect(input).toHaveClass('custom-input');
    expect(input).toHaveClass('border'); // Default class should still be there
  });

  it('should handle focus events', () => {
    const handleFocus = jest.fn();
    render(<Input onFocus={handleFocus} placeholder="Focus input" />);
    
    const input = screen.getByPlaceholderText('Focus input');
    fireEvent.focus(input);
    
    expect(handleFocus).toHaveBeenCalled();
  });

  it('should handle blur events', () => {
    const handleBlur = jest.fn();
    render(<Input onBlur={handleBlur} placeholder="Blur input" />);
    
    const input = screen.getByPlaceholderText('Blur input');
    fireEvent.blur(input);
    
    expect(handleBlur).toHaveBeenCalled();
  });

  it('should handle required attribute', () => {
    render(<Input required placeholder="Required input" />);
    const input = screen.getByPlaceholderText('Required input');
    expect(input).toHaveAttribute('required');
  });

  it('should handle readonly attribute', () => {
    render(<Input readOnly placeholder="Readonly input" />);
    const input = screen.getByPlaceholderText('Readonly input');
    expect(input).toHaveAttribute('readonly');
  });
});