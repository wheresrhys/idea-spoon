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
	if (ev.target.matches('button.down-vote')) {
		fetch('/' + id, {
			method: 'put',
			headers: {
		    'Accept': 'application/json',
		    'Content-Type': 'application/json'
		  },
			body: JSON.stringify({
				downVotes: 1 + +ev.target.dataset.value
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
