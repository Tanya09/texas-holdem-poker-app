import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HandCheckService {

  constructor() { }
  winningCards: string[] = [];
  private cardValues: string[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  private straightCardValues: string[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K' ];

  // Helper functions for all hand combinations

  /**
 * Checks if the given set of cards forms a Royal Flush.
 * A Royal Flush consists of cards of the same suit with values '10', 'J', 'Q', 'K', 'A' in sequence.
 * @param cards The array of cards to be checked.
 * @returns True if the cards form a Royal Flush, otherwise false.
 */
  isRoyalFlush(cards: string[]): boolean {
    const royalFlushValues = ['10', 'J', 'Q', 'K', 'A'];

    // Check if all cards are of the same suit
    const isSameSuit = cards.every(card => card.slice(-1) === cards[0].slice(-1));

    if (!isSameSuit) {
      return false;
    }

    // Check if the values are in the correct sequence for a Royal Flush
    const sortedValues = cards.map(card => card.slice(0, -1)).sort((a, b) => this.cardValues.indexOf(a) - this.cardValues.indexOf(b));
    return JSON.stringify(sortedValues) === JSON.stringify(royalFlushValues);
  }

  /**
  * it first checks if all cards have the same suit. If true, it sorts the card values and checks if they 
  * form a consecutive sequence. Additionally, it handles the special case where
  * A-2-3-4-5 is considered a valid straight
  * @param cards The array of cards to be checked.
  * @returns True if the cards form a Straight Flush, otherwise false.
  */
  isStraightFlush(cards: string[]): boolean {
    // Check if all cards are of the same suit
    const isSameSuit = cards.every(card => card.slice(-1) === cards[0].slice(-1));

    if (!isSameSuit) {
      return false;
    }

    // Sort the card values 
    const sortedValues = cards.map(card => this.cardValues.indexOf(card.slice(0, -1))).sort((a, b) => a - b);

    // Special case: A-2-3-4-5 is also a valid straight
    if (sortedValues[0] === 0 && sortedValues[1] === 1 && sortedValues[2] === 2 && sortedValues[3] === 3 && sortedValues[4] === 12) {
      this.winningCards = cards;
      this.winningCards.sort((a, b) => {
        const indexA = this.straightCardValues.indexOf(a.slice(0, -1));
        const indexB = this.straightCardValues.indexOf(b.slice(0, -1));
        return indexB - indexA; // Sort in ascending order
      });
      return true;
    }

    // Check if the values are consecutive
    for (let i = 0; i < sortedValues.length - 1; i++) {
      if (sortedValues[i + 1] - sortedValues[i] !== 1) {
        return false;
      }
    }
    this.winningCards = cards;
    this.winningCards.sort((a, b) => {
      const indexA = this.cardValues.indexOf(a.slice(0, -1));
      const indexB = this.cardValues.indexOf(b.slice(0, -1));
      return indexB - indexA; // Sort in ascending order
    });
    return true;
  }

  /**
  * This function counts the occurrences of each card value, adds remaining 1 high cards to form winnig hand
  * Then, it checks if there is any value with a count of four.
  * @param cards The array of cards to be checked.
  * @returns True if the cards form a Four of a Kind, otherwise false.
  */
  isFourOfAKind(cards: string[]): boolean {
    // Count occurrences of each card value
    const valueCounts: { [key: string]: number } = {};

    for (const card of cards) {
      const value = card.slice(0, -1);
      valueCounts[value] = (valueCounts[value] || 0) + 1;
    }
    // Find value with four occurrences
    const fourOfAKindValue = Object.keys(valueCounts).find(key => valueCounts[key] === 4);

    if (fourOfAKindValue) {
      this.winningCards = cards.filter(card => card.slice(0, -1) === fourOfAKindValue);

      // Push the highest remaining card to winningCards
      const remainingCards = cards.filter(card => card.slice(0, -1) !== fourOfAKindValue);
      remainingCards.sort((a, b) => this.cardValues.indexOf(b.slice(0, -1)) - this.cardValues.indexOf(a.slice(0, -1)));
      this.winningCards.push(remainingCards[0]);

      return true;
    }
    return false;
  }

  /**
   * This function counts the occurrences of each card value
   * It then checks if there is a three-of-a-kind and a pair, indicating a Full House
   * @param cards The array of cards to be checked.
   * @returns True if the cards form a Full House, otherwise false.
   */
  isFullHouse(cards: string[]): boolean {
    const valueCounts: { [key: string]: number } = {};
    for (const card of cards) {
      const value = card.slice(0, -1);
      valueCounts[value] = (valueCounts[value] || 0) + 1;
    }
    // Check for three of a kind and a pair
    let threeOfAKindValue: string | undefined;
    let pairValue: string | undefined;

    for (const key in valueCounts) {
      if (valueCounts[key] === 3) {
        threeOfAKindValue = key;
      } else if (valueCounts[key] === 2) {
        pairValue = key;
      }
    }
    // Get all cards with those values
    if (threeOfAKindValue && pairValue) {

      // Get all pair cards
      const pairCards = cards.filter(card => card.slice(0, -1) === pairValue);

      // Get all three of a kind cards
      const threeCards = cards.filter(card =>  card.slice(0, -1) === threeOfAKindValue );

      this.winningCards = [...threeCards, ...pairCards]

      // this.winningCards = cards.filter(card => card.slice(0, -1) === threeOfAKindValue || card.slice(0, -1) === pairValue);
    }
    return !!threeOfAKindValue && !!pairValue;
  }

  /**
  * This function iterates through the cards, to check that all cards have the same suit
  * @param cards The array of cards to be checked.
  * @returns True if the cards form a Flush, otherwise false.
  */
  isFlush(cards: string[]): boolean {
    const flushSuit = cards[0].slice(-1);

    // Array.every() to check if all cards have the same suit
    const isFlush = cards.every(card => card.slice(-1) === flushSuit);

    // Set the winning cards if it's a flush
    if (isFlush) {
      this.winningCards = cards.slice(0, 5);
      this.winningCards.sort((a, b) => {
        const indexA = this.cardValues.indexOf(a.slice(0, -1));
        const indexB = this.cardValues.indexOf(b.slice(0, -1));
        return indexB - indexA; // Sort in ascending order
      });
    }
    return isFlush;
  }

  /**
   * Collects the unique values of the cards, sorts them, and then checks if they form a consecutive sequence
   * @param cards The array of cards to be checked.
   * @returns True if the cards form a Straight, otherwise false.
   */
  isStraight(cards: string[]): boolean {
    const uniqueValues: Set<number> = new Set();

    for (const card of cards) {
      const value = this.cardValues.indexOf(card.slice(0, -1));
      uniqueValues.add(value);
    }

    const sortedValues = Array.from(uniqueValues).sort((a, b) => a - b);

    //check if all 5 values are unique
    if (sortedValues.length != 5) {
      return false;
    }

    // Special case: A-2-3-4-5 is also a valid straight
    if (sortedValues[0] === 0 && sortedValues[1] === 1 && sortedValues[2] === 2 && sortedValues[3] === 3 && sortedValues[4] === 12) {
      this.winningCards = cards;
      this.winningCards.sort((a, b) => {
        const indexA = this.straightCardValues.indexOf(a.slice(0, -1));
        const indexB = this.straightCardValues.indexOf(b.slice(0, -1));
        return indexB - indexA; // Sort in ascending order
      });
      return true;
    }

    // Check if the values form a consecutive sequence
    for (let i = 0; i < sortedValues.length - 1; i++) {
      if (sortedValues[i + 1] - sortedValues[i] !== 1) {
        return false;
      }
    }
    this.winningCards = cards;
    this.winningCards.sort((a, b) => {
      const indexA = this.cardValues.indexOf(a.slice(0, -1));
      const indexB = this.cardValues.indexOf(b.slice(0, -1));
      return indexB - indexA; // Sort in ascending order
    });
    return true;
  }

  /**
  * This is similar to four of a kind, it uses valueCounts check for 3 equal values, adds remaining 2 high cards to form winnig hand
  * @param cards The array of cards to be checked.
  * @returns True if the cards form a Three of a Kind, otherwise false.
  */
  isThreeOfAKind(cards: string[]): boolean {
    const valueCounts: { [value: string]: number } = {};
    let threeOfAKindValue: string | undefined;

    for (const card of cards) {
      const value = card.slice(0, -1);
      valueCounts[value] = (valueCounts[value] || 0) + 1;

      if (valueCounts[value] === 3) {
        threeOfAKindValue = value;
      }
    }

    if (threeOfAKindValue) {
      // Get all cards with the three of a kind value
      this.winningCards = cards.filter(card => card.slice(0, -1) === threeOfAKindValue);

      // Get the remaining cards (excluding the three of a kind)
      const remainingCards = cards.filter(card => card.slice(0, -1) !== threeOfAKindValue);

      // Sort remaining cards by index value
      remainingCards.sort((a, b) => {
        const indexA = this.cardValues.indexOf(a.slice(0, -1));
        const indexB = this.cardValues.indexOf(b.slice(0, -1));
        return indexB - indexA; // Sort in descending order
      });

      // Take the two highest remaining cards
      const highestRemainingCards = remainingCards.slice(0, 2);

      // Add the highest remaining cards to the winning hand
      this.winningCards.push(...highestRemainingCards);

      return true;
    }

    return false;
  }

  /**
   * This maintains a count of each card using the valueCounts object, adds remaining 1 high cards to form winnig hand
   * It then counts the number of pairs to see for exactly two pairs. 
   * @param cards The array of cards to be checked.
   * @returns True if the cards form Two of a Pair, otherwise false.
   */
  isTwoPair(cards: string[]): boolean {
    const valueCounts: { [value: string]: number } = {};
    let pairs = 0;
    let pairValues: string[] = [];

    for (const card of cards) {
      const value = card.slice(0, -1);
      valueCounts[value] = (valueCounts[value] || 0) + 1;

      // Check for two occurrences
      if (valueCounts[value] === 2) {
        pairs++;
        pairValues.push(value);
      }
    }

    if (pairs === 2) {
      // Sort pair values in descending order of their occurrence
      pairValues.sort((a, b) => {
        const indexA = this.cardValues.indexOf(a);
        const indexB = this.cardValues.indexOf(b);
        return indexB - indexA;
      });

      // Get all cards with those values
      const pairCards = cards.filter(card => pairValues.includes(card.slice(0, -1)));

      // Sort the pair cards
      pairCards.sort((a, b) => {
        const indexA = this.cardValues.indexOf(a.slice(0, -1));
        const indexB = this.cardValues.indexOf(b.slice(0, -1));
        return indexB - indexA;
      });

      // Add the remaining cards to the winning hand
      const remainingCards = cards.filter(card => !pairValues.includes(card.slice(0, -1)));

      // Concatenate the pair cards and remaining cards
      this.winningCards = [...pairCards, ...remainingCards];

      return true;
    }

    return false;
  }

  /**
  * This function counts the occurrences of each card value using valueCounts, adds remaining 3 high cards to form winnig hand
  * If it finds one pair by iterating through the counts, return true, else it returns false  
  * @param cards The array of cards to be checked.
  * @returns True if the cards form a Single Pair, otherwise false.
  */
  isOnePair(cards: string[]): boolean {
    const valueCounts: { [value: string]: number } = {};
    let pairValue: string | undefined;

    for (const card of cards) {
      const value = card.slice(0, -1);
      valueCounts[value] = (valueCounts[value] || 0) + 1;

      // Check for two occurrences
      if (valueCounts[value] === 2) {
        pairValue = value;
        break; // Break early once a pair is found
      }
    }

    if (pairValue) {
      // Get all cards with that value
      const pairCards = cards.filter(card => card.slice(0, -1) === pairValue);
      // Get the remaining cards (excluding the pair)
      const remainingCards = cards.filter(card => card.slice(0, -1) !== pairValue);

      // Sort remaining cards by index value
      remainingCards.sort((a, b) => {
        const indexA = this.cardValues.indexOf(a.slice(0, -1));
        const indexB = this.cardValues.indexOf(b.slice(0, -1));
        return indexB - indexA; // Sort in ascending order
      });
      // Take the top three remaining cards
      const topThreeCards = remainingCards.slice(0, 3);

      // Combine the pair with the top three cards to form the winning hand
      this.winningCards = [...pairCards, ...topThreeCards];

      return true;
    }

    return false;
  }
}
