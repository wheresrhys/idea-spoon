function getClosest(el, sel) {
	while (el && el !== document) {
		if (el.matches(sel)) {
			return el;
		}
		el = el.parentNode;
	}
}


function update(id, data) {
	return fetch('/' + id, {
			method: 'put',
			headers: {
		    'Accept': 'application/json',
		    'Content-Type': 'application/json'
		  },
			body: JSON.stringify(data)
		});
}

document.body.addEventListener('click', function (ev) {
	var id = getClosest(ev.target, '[data-id]').dataset.id;
	var votesEl = document.querySelector('.votes-' + id);
	if (ev.target.matches('button.down-vote')) {
		votesEl.textContent = votesEl.textContent - 1;
		update(id, {
			votes: votesEl.textContent
		})
	} else if (ev.target.matches('button.up-vote')) {
		votesEl.textContent = +votesEl.textContent + 1;
		update(id, {
			votes: votesEl.textContent
		})
	} else if (ev.target.matches('button.is-full')) {

		update(id, {
			isFull: true
		})
			.then(function () {
				ev.target.parentNode.removeChild(el);
			});
	} else if (ev.target.matches('button.lookup')) {

		update(id, {
			lookUp: true
		})
			.then(function () {
				ev.target.parentNode.removeChild(el);
			});
	} else if (ev.target.matches('button.is-done')) {

		update(id, {
			isDone: true
		})
			.then(function () {
				ev.target.parentNode.removeChild(el);
			});
	}

});
