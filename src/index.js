import React, { Component } from 'react';

var isInitialized = false;

function addScript(id, userId) {
	if(!id) {
		throw new Error('Google analytics ID is undefined');
	}

	if(isInitialized) {
		throw new Error('Google analytics is already initialized');
	}

	isInitialized = true;

	(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

	if (userId) {
		window.ga("create", id, {"userId": userId});
	} else {
		window.ga("create", id, "auto");
	}
}

export default class GoogleAnalytics extends Component {
	constructor(props, context) {
		super(props, context);

		this.state = {
			isClientReady: false
		};
	}

	componentDidMount() {
		GoogleAnalytics.init(this.props.id, this.props.userId);

		this.setState({
			isClientReady: true
		});
	}

	shouldComponentUpdate(props, state) {
		if(state.isClientReady) {
			this.pageview();
		}
		return false;
	}

	render() {
		return null;
	}

	pageview() {
		if(!this.context.router) {
			throw new Error('Router is not presented in the component context.');
		}

		var url = window.location.href;
		var startIndex = url.indexOf('app');
		var endIndex = (url.indexOf("?") !== -1) ? url.indexOf("?") : url.length;
		var path = url.substring(startIndex,endIndex);

		if(this.latestUrl === path) {
			return;
		}

		this.latestUrl = path;

		GoogleAnalytics.sendPageview(path);
	}

	static init(id, userId) {
		if(!isInitialized) {
			addScript(id, userId);
		}
	}

	static send(what, options) {
		if(!isInitialized) {
			throw new Error('Google analytics is not initialized');
		}

		window.ga('send', what, options);
	}

	static sendPageview(relativeUrl, title) {
		title = title || relativeUrl;

		return GoogleAnalytics.send('pageview', {
			'page': relativeUrl,
			'title': title
		});
	}
};

GoogleAnalytics.propTypes = {
	id              : React.PropTypes.string.isRequired,
	displayfeatures : React.PropTypes.bool,
	pageview        : React.PropTypes.bool,
	userId					: React.PropTypes.string
};

GoogleAnalytics.defaultProps = {
	displayfeatures: false,
	pageview: false,
	userId: null
};

GoogleAnalytics.contextTypes = {
	router: React.PropTypes.func.isRequired
};
