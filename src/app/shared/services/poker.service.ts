import { Injectable } from '@angular/core';
import { HandCheckService } from './hand-check.service';

export enum HandRankTag {
  RoyalFlush = 'Royal Flush',
  StraightFlush = 'Straight Flush',
  FourOfAKind = 'Four of a Kind',
  FullHouse = 'Full House',
  Flush = 'Flush',
  Straight = 'Straight',
  ThreeOfAKind = 'Three of a Kind',
  TwoPair = 'Two Pair',
  OnePair = 'One Pair',
  HighCard = 'High Card',
}

@Injectable({
  providedIn: 'root'
})
export class PokerService {
  constructor(private handCheckService: HandCheckService) { }

  // Define constants for card values and suits
  private cardValues: string[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  private straightCardValues: string[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

  /**
 * Calculates ranks for each player based on their hand combinations and community cards.
 * @param playersData Array of player data containing player name and hand cards.
 * @param communityCards Array of community cards.
 * @returns An array of ranked players with their card ranks, hand tags, winning cards, and actual standings.
 */
  calculateRanks(playersData: any[], communityCards: string[]): string[] {
    const rankedPlayers: any[] = [];

    // Loop through each player and calculate their rank
    for (const playerData of playersData) {
      const result = this.getBestHandCombination(playerData, communityCards);
      const playerRank = result.rank;
      const handRankTag = this.getHandRankTag(playerRank);
      const winningCards = result.winningCards;

      rankedPlayers.push({
        rank: playerRank,
        name: playerData.name,
        handTag: handRankTag,
        winningCards: winningCards,
        actualRank: null
      });
    }

    // Sorting the players based on their ranks and tiebreakers
    rankedPlayers.sort((a, b) => {
      // First, compare ranks
      if (a.rank !== b.rank) {
        return a.rank - b.rank;
      } else {
        // If ranks are equal, resolve tiebreakers
        this.resolveTiebreakerForRank(a.rank, [a, b]);
        // After resolving tiebreakers, prioritizing the player marked as winner
        return b.isWinner ? 1 : -1;
      }
    });
    this.computeActualPlayerStandings(rankedPlayers);
    return rankedPlayers;
  }

  /**
 * Computes the actual player standings based on their calculated ranks and hand tags.
 * @param rankedPlayers Array of ranked players with their calculated ranks and hand tags.
 * @returns None. Updates the actual ranks of the players in the input array that determins standings.
 */
  computeActualPlayerStandings(rankedPlayers: any[]): void {
    let currentRank = 1; // Start with rank 1
    let prevRank = null;
    let prevHandTagLength = null;
    outerLoopBreak: for (let i = 0; i < rankedPlayers.length; i++) {
      const currentPlayer = rankedPlayers[i];
      const prevPlayer = rankedPlayers[i - 1];
      let hasSameRank = true;
      // Check if current player's rank or hand tag length is different from the previous player
      if (prevRank === null || currentPlayer.rank !== prevRank || currentPlayer.handTag.length !== prevHandTagLength) {
        currentPlayer.actualRank = currentRank;
        // Increment current rank only when changing conditions are met
        currentRank++;
      } else {
        for (let j = 0; j < 5; j++) {
          let indexA, indexB;
          if (currentPlayer.rank === 2 || currentPlayer.rank === 6) {
            const sortedValues = currentPlayer.winningCards.map((card: string) => this.cardValues.indexOf(card.slice(0, -1))).sort((a: number, b: number) => a - b);
            if (sortedValues[0] === 0 && sortedValues[1] === 1 && sortedValues[2] === 2 && sortedValues[3] === 3 && sortedValues[4] === 12) {
              indexA = this.straightCardValues.indexOf(currentPlayer.winningCards[j].slice(0, -1));
              indexB = this.straightCardValues.indexOf(prevPlayer.winningCards[j].slice(0, -1));
            }
            else {
              indexA = this.cardValues.indexOf(currentPlayer.winningCards[j].slice(0, -1));
              indexB = this.cardValues.indexOf(prevPlayer.winningCards[j].slice(0, -1));
            }
          }
          else {
            indexA = this.cardValues.indexOf(currentPlayer.winningCards[j].slice(0, -1));
            indexB = this.cardValues.indexOf(prevPlayer.winningCards[j].slice(0, -1));
          }

          if (indexA < indexB) {
            currentPlayer.actualRank = currentRank;
            // Increment current rank only when changing conditions are met
            currentRank++;
            hasSameRank = false;
            continue outerLoopBreak;
          }
        }
        if (hasSameRank)
          currentPlayer.actualRank = currentRank - 1;
      }
      // Update previous rank and hand tag length
      prevRank = currentPlayer.rank;
      prevHandTagLength = currentPlayer.handTag.length;
    }
  }

  /**
 * Finds the best hand combination for a player given their hand cards and community cards.
 * @param playerData Object containing the player's name and hand cards.
 * @param communityCards Array of community cards.
 * @returns Object representing the best hand combination with its rank and winning cards.
 */
  getBestHandCombination(playerData: any, communityCards: string[]) {
    // Combine player's hand cards with community cards
    const allCards = [...playerData.cards, ...communityCards];

    // Initialize variables to store the best hand and its rank
    let bestHand: any = null;
    let setOfBestHands: any[] = [];
    // Generate all possible combinations of 5 cards out of 7
    const combinations = this.generateCombinations(allCards, 5);

    // Loop through each combination and find the best hand
    for (const combination of combinations) {
      // Check for different hand combinations
      const result = this.checkForHandCombination(combination);

      // If there are no best hands yet or the current hand is better than the existing ones, update the best hands
      if (setOfBestHands.length === 0 || result.rank < setOfBestHands[0].rank) {
        setOfBestHands = [result];
      } else if (result.rank === setOfBestHands[0].rank) {
        // If the current hand has the same rank as the existing best hands, use tiebreaker
        setOfBestHands.push(result);
        const tiedHandCombinations = setOfBestHands;

        let bestHandIndex = 0;
        for (let i = 1; i < tiedHandCombinations.length; i++) {
          for (let j = 0; j < 5; j++) { // Assuming each array has 5 elements
            if (tiedHandCombinations[0].rank === 2 || tiedHandCombinations[0].rank === 6) {
              //for elements where the formation is A-2-3-4-5
              const sortedValues = tiedHandCombinations[i].winningCards.map((card: string) => this.cardValues.indexOf(card.slice(0, -1))).sort((a: number, b: number) => a - b);
              if (sortedValues[0] === 0 && sortedValues[1] === 1 && sortedValues[2] === 2 && sortedValues[3] === 3 && sortedValues[4] === 12) {
                const indexA = this.straightCardValues.indexOf(tiedHandCombinations[i].winningCards[j].slice(0, -1));
                const indexB = this.straightCardValues.indexOf(tiedHandCombinations[bestHandIndex].winningCards[j].slice(0, -1));
                if (indexA > indexB) {
                  bestHandIndex = i;
                  break; // Exit the loop when we find a better hand
                } else if (indexA < indexB) {
                  break;
                }
              }
              else {
                const indexA = this.cardValues.indexOf(tiedHandCombinations[i].winningCards[j].slice(0, -1));
                const indexB = this.cardValues.indexOf(tiedHandCombinations[bestHandIndex].winningCards[j].slice(0, -1));

                if (indexA > indexB) {
                  bestHandIndex = i;
                  break; // Exit the loop when we find a better hand
                } else if (indexA < indexB) {
                  break;
                }
              }
            }
            else {
              const indexA = this.cardValues.indexOf(tiedHandCombinations[i].winningCards[j].slice(0, -1));
              const indexB = this.cardValues.indexOf(tiedHandCombinations[bestHandIndex].winningCards[j].slice(0, -1));

              if (indexA > indexB) {
                bestHandIndex = i;
                break; // Exit the loop when we find a better hand
              } else if (indexA < indexB) {
                break;
              }
            }
          }
        }
        setOfBestHands = tiedHandCombinations.slice(bestHandIndex, bestHandIndex + 1);
      }
    }
    bestHand = setOfBestHands[0]

    return bestHand;
  }

  /**
   * Generates all combinations of k elements from the given array.
   * @param allCards The input array from which combinations are generated.
   * @param lengthOfCombination The number of elements in each combination.
   * @returns An array of arrays representing all combinations of k elements from the input array.
   */
  private generateCombinations(allCards: any[], lengthOfCombination: number): any[][] {
    const result: any[][] = [];
    const recurse = (start: number, combination: any[]) => {
      if (combination.length === lengthOfCombination) {
        result.push(combination.slice());
        return;
      }
      for (let i = start; i < allCards.length; i++) {
        combination.push(allCards[i]);
        recurse(i + 1, combination);
        combination.pop();
      }
    };
    recurse(0, []);
    return result;
  }

  /**
   * Checks for the best hand combination among the given cards using Hand Check Service.
   * @param cards The array of cards to check for hand combinations.
   * @returns An object containing the rank of the best hand combination and its winning cards.
   */
  private checkForHandCombination(cards: string[]): any {
    // Using Hand Check Service for each combination
    if (this.handCheckService.isRoyalFlush(cards)) {
      return {
        rank: 1,
        winningCards: cards.slice(-5)
      };
    } else if (this.handCheckService.isStraightFlush(cards)) {
      return {
        rank: 2,
        winningCards: this.handCheckService.winningCards
      };
    } else if (this.handCheckService.isFourOfAKind(cards)) {
      return {
        rank: 3,
        winningCards: this.handCheckService.winningCards
      };
    } else if (this.handCheckService.isFullHouse(cards)) {
      return {
        rank: 4,
        winningCards: this.handCheckService.winningCards
      };
    } else if (this.handCheckService.isFlush(cards)) {
      return {
        rank: 5,
        winningCards: this.handCheckService.winningCards
      };
    } else if (this.handCheckService.isStraight(cards)) {
      return {
        rank: 6,
        winningCards: this.handCheckService.winningCards
      };
    } else if (this.handCheckService.isThreeOfAKind(cards)) {
      return {
        rank: 7,
        winningCards: this.handCheckService.winningCards
      };
    } else if (this.handCheckService.isTwoPair(cards)) {
      return {
        rank: 8,
        winningCards: this.handCheckService.winningCards
      };
    } else if (this.handCheckService.isOnePair(cards)) {
      return {
        rank: 9,
        winningCards: this.handCheckService.winningCards
      };
    } else {
      return {
        rank: 10,
        winningCards: cards.sort((a, b) => {
          const indexA = this.cardValues.indexOf(a.slice(0, -1));
          const indexB = this.cardValues.indexOf(b.slice(0, -1));
          return indexB - indexA; // Sort in descending order based on card values before returning
        })
      };
    }
  }

  /**
   * Retrieves the corresponding hand rank tags for a given rank.
   * @param rank The rank of the hand combination.
   * @returns An array of hand rank tags associated with the given rank.
   */
  private getHandRankTag(rank: number): HandRankTag[] {
    const handRankTags: HandRankTag[] = [];

    switch (rank) {
      case 1:
        handRankTags.push(HandRankTag.RoyalFlush);
        break;
      case 2:
        handRankTags.push(HandRankTag.StraightFlush);
        break;
      case 3:
        handRankTags.push(HandRankTag.FourOfAKind);
        break;
      case 4:
        handRankTags.push(HandRankTag.FullHouse);
        break;
      case 5:
        handRankTags.push(HandRankTag.Flush);
        break;
      case 6:
        handRankTags.push(HandRankTag.Straight);
        break;
      case 7:
        handRankTags.push(HandRankTag.ThreeOfAKind);
        break;
      case 8:
        handRankTags.push(HandRankTag.TwoPair);
        break;
      case 9:
        handRankTags.push(HandRankTag.OnePair);
        break;
      default:
        handRankTags.push(HandRankTag.HighCard);
        break;
    }

    return handRankTags;
  }

  /**
 * Resolves tiebreakers for players with the same rank.
 * @param players An array of players with the same rank.
 * @param rank The rank of the players' hand combinations.
 * @returns Void. Updates the players array with the winner marked and adds 'High Card' tag if necessary.
 */
  resolveTiebreakerForRank(rank: number, players?: any[], setOfHands?: any[]): void {
    const filteredPlayers = players?.filter(player => player.rank === rank);

    if (filteredPlayers) {
      if (filteredPlayers.length > 1) {
        // Sort players by winning cards for the specific rank
        let allIndicesEqual = true; // Flag to track if all indices remained the same

        filteredPlayers.sort((a, b) => {
          for (let i = 0; i < 5; i++) { //number of winning hands will have 5 cards
            const indexA = this.cardValues.indexOf(a.winningCards[i].slice(0, -1));
            const indexB = this.cardValues.indexOf(b.winningCards[i].slice(0, -1));

            if (indexA !== indexB) {
              allIndicesEqual = false;
              return indexB - indexA;
            }
          }
          return 0;
        });

        if (!allIndicesEqual) {
          // Mark the first player as the winner
          filteredPlayers[0].isWinner = true;
          if (!filteredPlayers[0].handTag.includes('High Card')) {
            // If 'High Card' doesn't exist, push it into the array
            filteredPlayers[0].handTag.push('High Card');
          }
        }
        // Unmark other players as winners
        for (let i = 1; i < filteredPlayers.length; i++) {
          filteredPlayers[i].isWinner = false;
        }
        //for cases where 2 same card sets may not be compared with each other
        if (allIndicesEqual && filteredPlayers[0].handTag.length > 0 && filteredPlayers[1].handTag.length > 0) {
          if (filteredPlayers[0].handTag.length != filteredPlayers[1].handTag.length) {

            if (filteredPlayers[0].handTag.length === 1 && filteredPlayers[1].handTag.length === 2) {
              filteredPlayers[0].handTag.push('High Card');
            }
            else if (filteredPlayers[1].handTag.length === 1 && filteredPlayers[0].handTag.length === 2) {
              filteredPlayers[1].handTag.push('High Card');
            }

          }
        }
      }
    }
  }

}
