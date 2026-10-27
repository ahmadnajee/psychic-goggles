'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////

const displayMovement = function (movements) {
  containerMovements.innerHTML = '';
  movements.forEach(function (move, i) {
    const type = move > 0 ? 'deposit' : 'withdrawal';
    const html = `
      <div class="movements__row">
          <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
          <div class="movements__date">3 days ago</div>
          <div class="movements__value">${move}</div>
      </div>
      `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcPrintBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, cur) => acc + cur, 0);
  labelBalance.textContent = `${acc.balance}€`;
};

const calcDisplaySummary = function (acc) {
  const income = acc.movements
    .filter(move => move > 0)
    .reduce((acc, move) => acc + move, 0);
  labelSumIn.textContent = `${income}€`;

  const outcome = acc.movements
    .filter(move => move < 0)
    .reduce((acc, move) => acc + move, 0);
  labelSumOut.textContent = `${Math.abs(outcome)}€`;

  const interest = acc.movements
    .filter(move => move > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, move) => acc + move, 0);

  labelSumInterest.textContent = `${interest}€`;
};

const createUserName = function (accs) {
  accs.forEach(function (acc) {
    acc.userName = acc.owner
      .toLowerCase()
      .split(' ')
      .map(word => word[0])
      .join('');
  });
};
createUserName(accounts);

// //////////////////////////////////////
// Event Handlers

function updateUI(acc) {
  // Display movements
  displayMovement(acc.movements);
  // Display balance
  calcPrintBalance(currentAccount);
  //Display summary
  calcDisplaySummary(currentAccount);
}

let currentAccount;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.userName === inputLoginUsername.value,
  );
  console.log(currentAccount);
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and welcome message
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;
    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';

    updateUI(currentAccount);
  } else {
    containerApp.style.opacity = 0;
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiver = accounts.find(acc => acc.userName === inputTransferTo.value);
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiver &&
    currentAccount.balance >= amount &&
    receiver?.userName != currentAccount.userName
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiver.movements.push(amount);
    updateUI(currentAccount);
    console.log('Transfer is valid');
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (
    amount > 0 &&
    currentAccount.movements.some(move => move >= amount * 0.1)
  ) {
    // Add movement
    currentAccount.movements.push(amount);
    // Update UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  // inputClosePin.value = inputCloseUsername.value = '';

  if (
    inputCloseUsername.value === currentAccount.userName &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.userName === currentAccount.userName,
    );

    // Delete the user
    accounts.splice(index, 1);
    // Hide the user
    containerApp.style.opacity = 0;
  }
  inputClosePin.value = inputCloseUsername.value = '';

  // console.log('hello world');
});
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

/////////////////////////////////////////////////
///////////////////////////////////////
// Coding Challenge #1

/* 
Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners about their dog's age, and stored the data into an array (one array for each). For now, they are just interested in knowing whether a dog is an adult or a puppy. A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years old.

Create a function 'checkDogs', which accepts 2 arrays of dog's ages ('dogsJulia' and 'dogsKate'), and does the following things:

1. Julia found out that the owners of the FIRST and the LAST TWO dogs actually have cats, not dogs! So create a shallow copy of Julia's array, and remove the cat ages from that copied array (because it's a bad practice to mutate function parameters)
2. Create an array with both Julia's (corrected) and Kate's data
3. For each remaining dog, log to the console whether it's an adult ("Dog number 1 is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy 🐶")
4. Run the function for both test datasets

HINT: Use tools from all lectures in this section so far 😉

TEST DATA 1: Julia's data [3, 5, 2, 12, 7], Kate's data 
TEST DATA 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]

GOOD LUCK 😀
*/

// const checkDogs = function (dogsJulia, dogsKate) {
//   const correctedJuliaDog = dogsJulia.slice();
//   correctedJuliaDog.splice(0, 1);
//   correctedJuliaDog.splice(-2);
//   const dogs = correctedJuliaDog.concat(dogsKate);
//   dogs.forEach(function (dog, i) {
//     console.log(
//       `Dog number ${i + 1} is ${dog > 3 ? 'and adult' : 'a puppy🐶'}, and is ${dog} years old `,
//     );
//   });
// };

// checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);

/*
const arr = ['a', 'b', 'c', 'd', 'e', 'f'];

// SLICE
console.log(arr);
console.log(arr.slice(1));
console.log(arr.slice(1, 5));
console.log(arr.slice(-1));

// SPLICE
// console.log(arr.splice(-1));
// console.log(arr.splice(1, 2));
// arr.splice(0);
console.log(arr);

// REVERSE
const arr2 = ['k', 'j', 'i', 'h', 'g', 'f'];
console.log(arr2);
console.log(arr2.reverse());
console.log(arr2);

// CONCAT
const letters = arr.concat(arr2);
console.log(letters);

// JOIN
console.log(letters.join(', '));


// At method
// const arr = [10, 20, 30];
// console.log(arr.at(-1));

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

movements.forEach(function (mov, i, arr) {
  if (mov > 0) {
    console.log(`${i + 1}:  deposited ${mov}`);
  } else {
    console.log(`${i + 1}: withdrew ${Math.abs(mov)} `);
  }
});
*/
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const euroUSDT = 1.1;
// const movementsUSDT = movements.map(move => move * euroUSDT);
// console.log(movements);
// console.log(movementsUSDT);

///////////////////////////////////////
// Coding Challenge #2

/* 
Let's go back to Julia and Kate's study about dogs. This time, they want to convert dog ages to human ages and calculate the average age of the dogs in their study.

Create a function 'calcAverageHumanAge', which accepts an arrays of dog's ages ('ages'), and does the following things in order:

1. Calculate the dog age in human years using the following formula: if the dog is <= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old, humanAge = 16 + dogAge * 4.
2. Exclude all dogs that are less than 18 human years old (which is the same as keeping dogs that are at least 18 years old)
3. Calculate the average human age of all adult dogs (you should already know from other challenges how we calculate averages 😉)
4. Run the function for both test datasets

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀
*/
// const calcAverageHumanAge = function (ages) {
//   const humanAges = ages.map(dog => (dog <= 2 ? 2 * dog : 16 + dog * 4));
//   const adultDogs = humanAges.filter(dog => dog >= 18);
//   const averageAge =
//     adultDogs.reduce((acc, dog) => (acc += dog), 0) / adultDogs.length;

//   console.log(humanAges);
//   console.log(adultDogs);
//   console.log(averageAge);
// };

// calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);

// const moveToUSD = account1.movements
//   .filter(move => move > 0)
//   .map(move => move * 1.1)
//   .reduce((acc, move) => acc + move, 0);

// console.log(moveToUSD);

// // Challenge #3
// const calcAverageHumanAge2 = ages =>
//   ages
//     .map(dog => (dog <= 2 ? 2 * dog : 16 + dog * 4))
//     .filter(dog => dog >= 18)
//     .reduce((acc, dog, i, arr) => acc + dog / arr.length, 0);

// console.log(calcAverageHumanAge2([5, 2, 4, 1, 15, 8, 3]));

// console.log(account1.movements);

// const withdrawals = account1.movements.findLast(move => move < 0);
// const latestLargeMovements = account1.movements.findLastIndex(
//   move => Math.abs(move) > 2000,
// );
// console.log(withdrawals);
// console.log(latestLargeMovements);
// const overallBalance = accounts
//   .map(acc => acc.movements)
//   .flat()
//   .reduce((acc, mover) => acc + mover, 0);
// console.log(overallBalance);

const breeds = [
  {
    breed: 'German Shepherd',
    averageWeight: 32,
    activities: ['fetch', 'swimming'],
  },
  {
    breed: 'Dalmatian',
    averageWeight: 24,
    activities: ['running', 'fetch', 'agility'],
  },
  {
    breed: 'Labrador',
    averageWeight: 28,
    activities: ['fetch', 'swimming'],
  },
  {
    breed: 'Beagle',
    averageWeight: 12,
    activities: ['digging', 'fetch'],
  },
  {
    breed: 'Husky',
    averageWeight: 26,
    activities: ['running', 'agility', 'swimming'],
  },
  {
    breed: 'Bulldog',
    averageWeight: 36,
    activities: ['sleeping'],
  },
  {
    breed: 'Poodle',
    averageWeight: 18,
    activities: ['agility', 'fetch'],
  },
];
// Task 1
const huskyWeight = breeds.find(dogs => dogs.breed === 'Husky').averageWeight;
console.log(huskyWeight);
// Task 2
const dogBothActivities = breeds.find(
  dogs =>
    dogs.activities.includes('running') && dogs.activities.includes('fetch'),
);
console.log(dogBothActivities);

// Task 3
const allActivities = breeds.flatMap(dogs => dogs.activities);
console.log(allActivities);

// Task 4
const uniqueActivities = [...new Set(breeds.flatMap(dogs => dogs.activities))];
console.log(uniqueActivities);

// Task 5
const swimmingAdjacent = breeds
  .filter(dog => dog.activities.includes('swimming'))
  .flatMap(dog => dog.activities.filter(activity => activity !== 'swimming'));
console.log(swimmingAdjacent);

// Task 6
const averageWeight = breeds.map(dog => dog.averageWeight > 10);
console.log(averageWeight);

// Task 7
const activeDogs = breeds.map(dog => dog.activities.length > 2);
console.log(activeDogs);

// Bonus
const heaviestFetchDog = breeds
  .filter(dog => dog.activities.includes('fetch') && dog.activities.length > 1)
  .reduce((max, dog) => (dog.averageWeight > max.averageWeight ? dog : max));
console.log(heaviestFetchDog);
