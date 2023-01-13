import min from '../constants/constants';

export default function checkLimit(side: number, maxSide: number): number {
  if (side >= maxSide) return maxSide;
  if (side <= min) return min;
  return side;
}
