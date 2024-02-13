import { TestBed } from '@angular/core/testing';

import { HandRankTag, PokerService } from './poker.service';

import { HandCheckService } from './hand-check.service';

describe('PokerService', () => {
  let pokerService: PokerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    pokerService = TestBed.inject(PokerService);
  });

  it('should be created', () => {
    expect(pokerService).toBeTruthy();
  });

  describe('calculateRanks', () => {
    it('should return the best hand combination correctly', () => {
      // Mock player data and community cards
      const playerData = { cards: ['AS', 'KS'], name: 'Player1' };
      const communityCards = ['QS', 'JS', 'TS', '9S', '8S'];

      // Call the method to get the best hand combination
      const bestHand = pokerService.getBestHandCombination(playerData, communityCards);

      // Define the expected result
      const expectedBestHand = {
        rank: 1,
        winningCards: ['AS', 'KS', 'QS', 'JS', 'TS'] // Royal Flush with Spades
      };

      // Expect the best hand to match the expected result
      expect(bestHand).toEqual(expectedBestHand);
    });

    it('should resolve tiebreakers correctly', () => {
      // Mock players with tied ranks
      const players = [
        { name: 'Player1', rank: 2, winningCards: ['AS', 'KS', 'QS', 'JS', 'TS'], handTag: ['StraightFlush'], isWinner: false },
        { name: 'Player2', rank: 2, winningCards: ['AD', 'KD', 'QD', 'JD', 'TD'], handTag: ['StraightFlush'], isWinner: false },
        { name: 'Player3', rank: 2, winningCards: ['AH', 'KH', 'QH', 'JH', 'TH'], handTag: ['StraightFlush'], isWinner: false }
      ];

      // Call the method to resolve tiebreakers
      pokerService.resolveTiebreakerForRank(2, players);

      // Expect only one player to be marked as the winner
      let numberOfWinners = 0;
      players.forEach(player => {
        if (player.isWinner) {
          numberOfWinners++;
          // Expect the winning player to have 'High Card' tag if necessary
          expect(player.handTag).toContain('High Card');
        }
      });
      expect(numberOfWinners).toBe(1);
    });

  });
});
