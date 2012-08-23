class Nori

	constructor: ->
		@beans = []
		@instances = {}

	# Add many beans at once
	addBeans: (beans) ->
		@addBean bean for bean in beans

	# Add single bean
	addBean: (bean) ->

		# Remove old bean, when duplicate
		oldBean = @_beanByName(bean.name)

		if oldBean
			oldBeanIndex = @beans.indexOf oldBean
			@beans.splice oldBeanIndex, 1

		# Store new bean
		@beans.push bean

	# Return the instance of a bean
	instance: (beanName) ->
		bean = @_beanByName beanName
		
		if bean and bean.type
			if bean.singleton == false
				return @_newInstance bean
			else
				@instances[beanName] = @_newInstance(bean) unless @instances[beanName]
				return @instances[beanName]

		null
	
	# Instantiate bean
	_newInstance: (bean) =>
		constructorParams = []

		# Get instances for constructor params
		if bean.constructor
			for param in bean.constructor
				do =>
					constructorParams.push @instance(param)
		
		# Create dummy class, to allow applying constructor params
		typeProxy = ->
		typeProxy.prototype = bean.type.prototype

		# Apply constructor params to new instance
		instance = new typeProxy
		bean.type.apply(instance, constructorParams)

		# Set instance properties
		if bean.properties instanceof Array
			for property in bean.properties
				do =>
					instance[property] = @instance(property)
		else if bean.properties instanceof Object
			for propertyName, beanName of bean.properties
				do =>
					instance[propertyName] = @instance(beanName)

		instance

	# Find bean by name
	_beanByName: (beanName) ->
		foundBean = null
		
		for bean in @beans
			do ->
				foundBean = bean if bean.name == beanName

		foundBean

# Make it global
window.Nori = Nori