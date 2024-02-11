import { TestBed } from '@angular/core/testing';

import { HandCheckService } from './hand-check.service';

describe('HandCheckService', () => {
  let service: HandCheckService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HandCheckService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should correctly identify a Royal Flush', () => {
    const cards = ['10H', 'JH', 'QH', 'KH', 'AH']; // Royal Flush
    expect(service.isRoyalFlush(cards)).toBe(true);
  });

  it('should correctly identify a Straight Flush', () => {
    const cards = ['9H', '10H', 'JH', 'QH', 'KH']; // Straight Flush
    expect(service.isStraightFlush(cards)).toBe(true);
  });

  
  it('should correctly identify a Straight Flush with A-2-3-4-5', () => {
    const cards = ['AH', '2H', '3H', '4H', '5H']; // Straight Flush (A-2-3-4-5)
    expect(service.isStraightFlush(cards)).toBe(true);
  });

  it('should correctly identify a Four of a Kind', () => {
    const cards = ['3H', '3D', '3S', '3C', '5H']; // Four of a Kind
    expect(service.isFourOfAKind(cards)).toBe(true);
  });
  
  it('should correctly identify a Four of a Kind with different suits', () => {
    const cards = ['3H', '3D', '3S', '3C', '5D']; // Four of a Kind (different suits for kicker should be considered samw)
    expect(service.isFourOfAKind(cards)).toBe(true);
  });

  it('should correctly identify a Full House', () => {
    const cards = ['3H', '3D', '3S', '5C', '5H']; // Full House
    expect(service.isFullHouse(cards)).toBe(true);
  });
  
  // it('should correctly identify a Full House with different suits', () => {
  //   const cards = ['3H', '3D', '3S', '5C', '5D']; // Full House (different suits)
  //   expect(service.isFullHouse(cards)).toBe(true);
  // });

  it('should correctly identify a Flush', () => {
    const cards = ['2H', '4H', '6H', '8H', '10H']; // Flush
    expect(service.isFlush(cards)).toBe(true);
  });

  it('should correctly identify a Straight', () => {
    const cards = ['2H', '3D', '4S', '5C', '6H']; // Straight
    expect(service.isStraight(cards)).toBe(true);
  });

  it('should correctly identify a Straight with different suits', () => {
    const cards = ['AD','2H', '3D', '4S', '5C']; // Straight
    expect(service.isStraight(cards)).toBe(true);
  });

  it('should correctly identify a Three of a Kind', () => {
    const cards = ['3H', '3D', '3S', '5C', '8H']; // Three of a Kind
    expect(service.isThreeOfAKind(cards)).toBe(true);
  });

  it('should correctly identify a Three of a Kind with different suits', () => {
    const cards = ['AH', 'AD', 'AS', 'KC', 'QD']; // Three of a Kind (different suits)
    expect(service.isThreeOfAKind(cards)).toBe(true);
  });

  it('should correctly identify Two Pair', () => {
    const cards = ['2H', '2D', '5S', '5C', '8H']; // Two Pair
    expect(service.isTwoPair(cards)).toBe(true);
  });

  it('should correctly identify Two Pair with different suits', () => {
    const cards = ['AH', 'AD', 'QS', 'QC', 'KD']; // Two Pair (different suits)
    expect(service.isTwoPair(cards)).toBe(true);
  });

  it('should correctly identify One Pair', () => {
    const cards = ['2H', '2D', '5S', '7C', '8H']; // One Pair
    expect(service.isOnePair(cards)).toBe(true);
  });

  it('should correctly identify One Pair with different suits', () => {
    const cards = ['KH', 'KD', '8S', '9C', '10D']; // One Pair (different suits)
    expect(service.isOnePair(cards)).toBe(true);
  });
 
});
