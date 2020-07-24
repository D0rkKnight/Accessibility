/*
 * Credit to Youtube channel Web Deb Simplified for his great tutorials
 * that helped with this project. You can find his Youtube channel here:
 * https://www.youtube.com/channel/UCFbNIlppjAuEX4znoulh0Cw
 * 
 * Javascript is actually black magic
 */

var textElement, optionButtonsElement, containerElement, gameElement, difficulty
const assetDir = 'assets/'
function init() {
	textElement = document.getElementById('text')
	optionButtonsElement = document.getElementById('optionButtons')
	containerElement = document.getElementById('container')

	let state = {}
	startGame()
}

function startGame() {
	state = {}
	showTextNode(2)
}

function showTextNode(textNodeIndex) {
	//Retrieve data
	const textNode = textNodes.find(textNode => textNode.id === 
		textNodeIndex)
	if (textNode == null) alert("Node "+textNodeIndex+" not found")

	//Run in game events
	if (textNode.event != null) textNode.event()

	//Clear buttons
	while (optionButtonsElement.firstChild) {
		optionButtonsElement.removeChild(optionButtonsElement.firstChild)
	}

	if (!textNode.dontShowText) {
		//Assign text
		textElement.innerText = textNode.text

		//Generate new buttons
		textNode.options.forEach(option => {
			if (showOption(option)) {
				const button = document.createElement('button')
				button.innerText = option.text
				button.classList.add('btn')
				button.addEventListener('click', () => selectOption(option))
				optionButtonsElement.appendChild(button)
			}
		})
	} else {
		//Disable elements
		textElement.innerText = ''
	}
}

function showOption(option) {
	return option.requiredState == null || option.requiredState(state)
}

function selectOption(option) {
	const nextTextNodeId = option.nextText
	state = Object.assign(state, option.setState)
	if (option.event != null) option.event()

	showTextNode(nextTextNodeId)
}

var life
function initMatchingGame() {
	gameElement = document.createElement('div')
	gameElement.id = 'matchingGame'

	container.appendChild(gameElement)

	//Game mechanics
	difficulty = 1

	//Init instructions
	var instructions = document.createElement('div')
	instructions.id = 'instructions'

	gameElement.appendChild(instructions)

	var text = document.createElement('p')
	text.innerHTML = 'Find this'
	text.id = 'instructionsText'
	instructions.appendChild(text)

	//Init game grid
	var grid = document.createElement('div')
	grid.id = 'gameGrid'

	gameElement.appendChild(grid)

	genCards(instructions, grid, difficulty)

	//Overhead bar
	life = 5
	var lifebar = document.createElement('div')
	lifebar.id = 'overhead'
	gameElement.appendChild(lifebar)

	//Generate hearts
	for (var i=0; i<life; i++) {
		var heart = document.createElement('img')
		heart.classList.add('heartIcon')
		heart.src = assetDir + 'heart.png'

		lifebar.appendChild(heart)
	}
}

function clearMatchingGame() {
	//Clear the game grid
	while(gameElement.firstChild) {
		gameElement.removeChild(gameElement.firstChild)
	}

	gameElement.parentNode.removeChild(gameElement)
}

function genCards(instructions, grid, difficulty) {
	//Clear cards
	matchingCards = []
	while (grid.firstChild) {
		grid.removeChild(grid.firstChild)
	}
	//Clear instructions
	var ref = document.getElementById(
		'matchingCardsInstructionReference')
	if (ref != null) ref.parentNode.removeChild(ref)

	//Generate bottom cards
	var cardCount = 8
	var rand = Math.floor(Math.random() * 8)

	//Begin by generating an anchor and basing all variation off of that
	const anchor = {
		invert: Math.random() * 50,
		sepia: 70 + Math.random() * 500,
		saturate: 200 + Math.random() * 200,
		contrast: 100 + Math.random() * 50,
		'hue-rotate': Math.floor(Math.random() * 1440),
		'drop-shadow': genColor()
	}
	for (var i = 0; i<8; i++) {
		//Generate a card
		const cardStruct = {
			src: assetDir + 'pic1' + '.png',
			id: i,
			filters: {
				invert: '%',
				sepia: '%',
				saturate: '%',
				contrast: '%',
				'hue-rotate': 'deg',
				'drop-shadow': '5px 10px 0px '
			}
		}
		//Insert values
		for (var j in cardStruct.filters) {
			if (j == 'drop-shadow') cardStruct.filters[j] += anchor[j]
			else cardStruct.filters[j] = genFilter(anchor[j]) + cardStruct.filters[j]
		}
		console.log('\n')


		matchingCards.push(cardStruct)
		var card = genMatchingCard(cardStruct)
		grid.appendChild(card)

		//Attach the choice event
		if (i == rand) {
			card.addEventListener('click', function(){
				chooseMatchingCard(true, instructions, grid)
			})
		} else {
			card.addEventListener('click', function(){
				chooseMatchingCard(false, instructions, grid)
			})
		}
	}

	//Retrieve one random card that you're looking for
	
	var cardData = matchingCards.find(card => card.id === rand)
	var card = genMatchingCard(cardData)
	card.disabled = true
	card.id = 'matchingCardsInstructionReference'
	instructions.appendChild(card)
}

function genFilter(anchor) {
	//Some value between -anchor and +anchor
	var dist = anchor
	dist *= (Math.random() - 0.5) * 2

	//Divide by difficulty to make range smaller
	dist /= difficulty
	out = anchor + dist

	console.log(out)

	return out
}

function chooseMatchingCard(isRight, instructions, grid) {
	if (isRight) {
		difficulty += 0.1
		genCards(instructions, grid, difficulty)
	} else {
		removeHeart()
	}
}

function genMatchingCard(struct) {
	const card = document.createElement('INPUT')
	card.setAttribute("type", "image")
	card.src = struct.src
	card.classList.add('matchingCard')

	//Add in filters
	for (var i in struct.filters) {
		card.style.filter += i+'('+struct.filters[i]+')'
	}

	return card
}

function removeHeart() {
	var overhead = document.getElementById('overhead')

	if (overhead.firstChild) overhead.removeChild(overhead.firstChild)

	if (!overhead.firstChild) {
		clearMatchingGame()
		showTextNode(6)
	}
}

function genColor() {
	var letters = '0123456789ABCDEF'
	var color = '#'
	for (var i=0; i<6; i++) {
		color += letters[Math.floor(Math.random() * 16)]
	}
	return color
}

const textNodes = [
	{
		id: 1,
		text: 'Greetings there.',
		options: [
			{
				text: '...',
				nextText: 2
			}
		]
	},
	{
		id: 2,
		text: 'you do something',
		options: [
			{
				text: 'Image matching game',
				nextText: 3
			},
			{
				text: 'Rhythm game',
				nextText: 4
			},
			{
				text: 'Memory game',
				nextText: 5
			}
		]
	},
	{
		id: 3,
		text: 'Image matching game',
		event: initMatchingGame,
		dontShowText: true
	},
	{
		id: 4,
		text: 'Rhythm game'
	},
	{
		id: 5,
		text: 'Memory game'
	},
	{
		id: 6,
		text: 'GAME OVER'
	}
]

const matchingImages = ['pic1', 'pic2', 'pic3']
var matchingCards = []

window.onload = init