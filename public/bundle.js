function getClosest(el, sel) {
	while (el && el !== document) {
		if (el.matches(sel)) {
			return el;
		}
		el = el.parentNode;
	}
}


document.body.addEventListener('click', function (ev) {
	var id = getClosest(ev.target, '[data-id]').dataset.id;
	var votesEl = document.querySelector('.votes-' + id);
	if (ev.target.matches('button.down-vote')) {
		votesEl.value = votesEl.value - 1;
		fetch('/' + id, {
			method: 'put',
			headers: {
		    'Accept': 'application/json',
		    'Content-Type': 'application/json'
		  },
			body: JSON.stringify({
				votes: votesEl.value
			})
		});
	} else if (ev.target.matches('button.up-vote')) {
		votesEl.value = +votesEl.value + 1;
		fetch('/' + id, {
			method: 'put',
			headers: {
		    'Accept': 'application/json',
		    'Content-Type': 'application/json'
		  },
			body: JSON.stringify({
				votes: votesEl.value
			})
		});
	} else if (ev.target.matches('button.is-full')) {
		fetch('/' + id, {
			method: 'put',
			headers: {
		    'Accept': 'application/json',
		    'Content-Type': 'application/json'
		  },
			body: JSON.stringify({
				isFull: true
			})
		})
			.then(function () {
				ev.target.parentNode.removeChild(el);
			});
	}
});
