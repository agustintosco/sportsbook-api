# GreenRun Sports API

## Table of Contents

- Description
- Installation
- Usage / Documentation
- Technologies
- Roadmap / Pending Features
- Contributing
- Authors

---

## Description

This project is an API for a Sports Bet App where you can register & login users, create Sports, Events, make Transactions like: deposits, withdrawals & Bets.

As an ADMIN user, you can create and set Bet Options related to a specific event, assigning to them the corresponding odd. This odd will be used to calculate the amount to pay if a user made a Bet on a winning Bet Option.

As a USER, you can make transactions as deposits, withdrawals and bets on specific Events and Bet Options and also cancel a bet (if it is not already in a SETTLED state). As well, you can edit you personal profile data.

---

## Installation

Clone the project and install dependencies:

```bash
git clone https://github.com/agustintosco/options-strategy-bot.git
```

```bash
npm install
```

---

## Usage / Documentation

Run the following command:

```bash
npm run start
```

And that's it!

For documentations about endpoints, entities, DTOs, etc; you can just hit:

     `HOST:PORT/documentation`

---

## Technologies

- Typescript
- NestJS
- TypeORM
- MySQL
- Amazon Web Services (EC2 & RDS)
- Passport / JWT
- NestJS Event Emitter Module
- Swagger
- bcrypt (for password hashing)

This project is currently deployed at:

    http://ec2-54-211-142-150.compute-1.amazonaws.com:8080

---

## Roadmap / Pending Features

- Include Testing.
- Add automatic set of Bet Option result (WON / LOST).
- Split Bet amount from winning amount to actually calculate the historic returns (+ / -).
- Add filters for Bets, i.e. BetStatus (ACTIVE / CANCELED / SETTLED) and BetResult (WON / LOST).

---

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---

## Authors

Agustin Tosco

Where to find me:

| GitHub                                    | GitLab                                    | Linkedin                                               | Twitter                                 |
| ----------------------------------------- | ----------------------------------------- | ------------------------------------------------------ | --------------------------------------- |
| [GitHub](https://github.com/agustintosco) | [GitLab](https://gitlab.com/agustintosco) | [LinkedIn](https://www.linkedin.com/in/agustin-tosco/) | [Twitter](https://twitter.com/agust_t_) |

---
