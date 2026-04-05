let currentState = welcoming;

const menu = {
  coffee:{
    sizes: ["small", "medium", "large"],
    types: ["latte", "cappuccino", "americano"],
    temperatures:["iced", "hot"]
  },
  tea: {
    sizes: ["small", "medium", "large"],
    types: ["peppermint", "herbal", "green", "matcha", "vanilla matcha"],
    temperatures:["iced", "hot"]
  }
};

const upsellItems = ["water", "scone"];

let order = [];

export function handleInput(sInput) {
  return currentState(sInput);
}

export function clearInput(){
  currentState = welcoming;
  order = [];
}

function welcoming() {
  let aReturn = [];
  currentState = ordering;

  aReturn.push("Welcome to The Velvet Roast!");
  aReturn.push("What would you like? (coffee or tea)");

  return aReturn;
}

function ordering(sInput) {
  let aReturn = [];
  const input = sInput.toLowerCase();

  if(menu[input]){
    currentState = choosingSize;
    order.push({item: input});

    aReturn.push(`You chose ${input}. What size? ${menu[input].sizes.join(", ")}`);

  } else {
    aReturn.push("Sorry, we only have coffee or tea.");
  }

  return aReturn;
}

function choosingSize(sInput){
  let aReturn = [];
  const size = sInput.toLowerCase();
  const lastItem = order[order.length-1];

  if(menu[lastItem.item].sizes.includes(size)){
    lastItem.size = size;
    currentState = choosingType;

    aReturn.push(`Nice. What type? ${menu[lastItem.item].types.join(", ")}`);

  } else {
    aReturn.push("Invalid size. Try again.");
  }

  return aReturn;
}

function choosingType(sInput){
  let aReturn = [];
  const type = sInput.toLowerCase();
  const lastItem = order[order.length-1];

  if(menu[lastItem.item].types.includes(type)){
    lastItem.type = type;
    currentState = choosingTemperature;

    aReturn.push(`Got it. Hot or iced? (${menu[lastItem.item].temperatures.join(", ")})`);

  } else {
    aReturn.push("Invalid type. Try again.");
  }

  return aReturn;
}

function choosingTemperature(sInput){
  let aReturn = [];
  const temp = sInput.toLowerCase();
  const lastItem = order[order.length-1];

  if(menu[lastItem.item].temperatures.includes(temp)){
    lastItem.temperature = temp;
    currentState = anotherItem;

    aReturn.push(`Perfect. Added ${temp} ${lastItem.size} ${lastItem.type} ${lastItem.item}.`);
    aReturn.push("Would you like anything else? (yes or no)");

  } else {
    aReturn.push("Invalid temperature. Try again.");
  }

  return aReturn;
}

// ---------------- MULTIPLE ITEMS ----------------

function anotherItem(sInput){
  let aReturn = [];
  const input = sInput.toLowerCase();

  if(input === "yes" || input === "y"){
    currentState = orderingAny;
    aReturn.push(`What would you like? (coffee, tea, ${upsellItems.join(", ")})`);

  } 
  else if(
    input === "no" || 
    input === "n" || 
    input === "no thanks" || 
    input === "nah" || 
    input === "nope"
  ){
    aReturn.push(showOrder());
    aReturn.push("Thank you for your order!");
    currentState = welcoming;

  } 
  else {
    aReturn.push("Please type yes or no.");
  }

  return aReturn;
}

function orderingAny(sInput) {
  let aReturn = [];
  const input = sInput.toLowerCase();

  if (menu[input]) {
    currentState = choosingSize;
    order.push({ item: input });
    aReturn.push(`You chose ${input}. What size? ${menu[input].sizes.join(", ")}`);

  } else if (upsellItems.includes(input)) {
    order.push({ extra: input });
    aReturn.push(`${input} added to your order.`);
    aReturn.push("Would you like anything else? (yes or no)");
    currentState = anotherItem;

  } else {
    aReturn.push(`Sorry, we only have coffee, tea, ${upsellItems.join(", ")}.`);
  }

  return aReturn;
}

// ---------------- UPSELL ----------------

function upsell(sInput){
  let aReturn = [];
  const input = sInput.toLowerCase();

  if(upsellItems.includes(input)){
    order.push({extra: input});
    aReturn.push(`${input} added to your order.`);
  } 
  else if(
    input === "no" || 
    input === "no thanks" || 
    input === "nah" || 
    input === "nope"
  ){
    aReturn.push("No extras added.");
  } 
  else {
    aReturn.push("No extras added.");
  }

  aReturn.push(showOrder());
  aReturn.push("Thank you for your order!");

  currentState = welcoming;

  return aReturn;
}

// ---------------- SHOW ORDER ----------------

function showOrder(){
  let text = "Your order:\n";

  for(let item of order){
    if(item.item){
      text += `${item.temperature} ${item.size} ${item.type} ${item.item}\n`;
    }
    if(item.extra){
      text += `Extra: ${item.extra}\n`;
    }
  }

  return text;
}