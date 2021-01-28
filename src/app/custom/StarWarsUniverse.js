import Starship from "./Starship";
export default class StarWarsUniverse {
  static starships = [];
  constructor() {}
  static async _getStarshipCount() {
    const { count } = await (
      await fetch("https://swapi.dev/api/starships/")
    ).json();
    return count;
  }
  static async init() {
    await this._createStarships(await this._getStarshipCount());
  }
  //https://swapi.booost.bg/api/starships/
  static async _createStarships(count) {
    const sumArr = [];
    let pages = count % 10 === 0 ? count / 10 : Math.floor(count / 10 + 1); // if count is not a number divisible by 10 add one more page
    // retriveing data from api
    for (let i = 1; i <= pages; i++) {
      const { results } = await (
        await fetch(`https://swapi.dev/api/starships/?page=${i}`)
      ).json();
      sumArr.push(...results);
    }
    // creating starships
    sumArr.forEach((e) => {
      const { consumables, passengers, name } = e;
      let validationResult = this._validateData(consumables, passengers);
      if (validationResult.length == 2) {
        this.starships.push(
          new Starship(name, validationResult[0], validationResult[1])
        );
      }
    });
  }
  /**
   *
   * @param {string} consumable
   * @param {string} passengers
   * This method checks if the parameters meet the criteria and parses the data
   * @returns {number[]} If BOTH parameters pass an array with number 2 values is returned first is for the Consumables
   * second is for the Passengers
   */
  static _validateData(consumable, passengers) {
    if (
      consumable !== undefined &&
      consumable !== null &&
      consumable !== "unknown" &&
      passengers !== undefined &&
      passengers !== null &&
      passengers !== "n/a" &&
      passengers !== "unknown" &&
      passengers !== "0"
    ) {
      // validation passes now to parse the data
      // parsing consumable data
      let parsedConsumable;
      let splitConsumableString = consumable.split(" ");
      if (splitConsumableString[1].includes("year")) {
        parsedConsumable = Number(splitConsumableString[0]) * 365;
      } else if (splitConsumableString[1].includes("month")) {
        parsedConsumable = Number(splitConsumableString[0]) * 30;
      } else {
        parsedConsumable = Number(splitConsumableString[0]) * 7;
      }

      // parsing passengers data
      const parsedPassengers = Number(passengers.replace(",", ""));
      return [parsedConsumable, parsedPassengers];
    }

    return [];
  }

  static get theBestStarship() {
    this.starships.sort((a, b) => b.maxDaysInSpace - a.maxDaysInSpace);
    return this.starships[0];
  }
}
