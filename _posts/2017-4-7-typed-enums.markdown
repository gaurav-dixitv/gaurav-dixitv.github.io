---
layout: post
title:  "strongly typed"
date:   2017-5-5 00:00:00 +0530
categories: cpp
excerpt: "scoped enums, std::underlying_type, std::enable_if, static_assert and more."
comments: true

loadScripts: false
scripts: []
---

An Enumeration (type) is a way of using symbolic constants without woring about the underlying type (albiet it being important - more on this later). You are looking at a potential use of an enumeration when a certain set of related but discreet variables map to real-life symbols. For example, you would represent days of the week in a enum like so

{% highlight cpp %}
enum Day{
    Monday,
    Tuesday,
    Wednesday,
    Thursday,
    Friday,
    Saturday,
    Sunday
};

Day today = Monday;
...
...
if(today == Monday){
    std::cout << "Yay - a Monday!" << std::endl;
}
{% endhighlight %}

Sweet. Oh but hold on.

{% highlight cpp %}

Day today = Monday * Tuesday;                   //umm, what?!
Day someDay = Monday | Wednesday & Friday;      //haha

Day alwaysSunday = Sunday;
if (alwaysSunday){
    std::cout << "Sunday morning is everyday for all I care." << std::endl;   //Always executed.
} else{
    //never gets executed :/
}

enum Color { Red, Green, Blue };
enum Mood  { Angry, Blue, Churlish, Depressed, Euphoric = 0xFFFF0000 };      //ERROR! Oops, Blue was already declared!

{% endhighlight %}

Hmm. That was a mess. The problems:
1. Implicit casting.  `Day today = Monday * Tuesday;` Does not make sense, but is perfectly legal. Enums are casted to ints here. So essentially, you are looking at `Day today = 0 * 1`.
2. Enums are extensively used as flags. Code like `FocusReason reason = FocusReason::Text | FocusReason::User;` makes sense. This really does not work for `Monday | Wednesday & Friday`.
3. `if (alwaysSunday){` is always 'true' (except for Day::Monday) due to the implicit cast.
4. Enums do not define scope. This implies, you caanot do something like `enum AmazonAnimals = { Hyena, Bear }; enum Pets = { Hyena, dog }`.
5. The spec mandates an enum to have an integral underlying type. The actual underlying type can be implementation specific (you will see different values on gcc/borland).

Scoped enums to the rescue. The modified code now looks like:

{% highlight cpp %}
enum class Day{
    Monday,
    Tuesday,
    Wednesday,
    Thursday,
    Friday,
    Saturday,
    Sunday
};

Day today = Monday;     //Error! Unknown identifier. This should now be Day::Monday.
...
...
if(today == Monday){    //Error! Should be Day::Monday.
    std::cout << "Yay - a Monday!" << std::endl;
}
{% endhighlight %}

Strongly typed enums define a scope(duh). So Monday, now needs it's full signature: `Day::Monday`.

{% highlight cpp %}
Day today = Monday * Tuesday;                   //Error! Operator * not defined for Day.
Day someDay = Monday | Wednesday & Friday;      //Error! Operators | and & not defined for Day.

Day alwaysSunday = Day::Sunday;              
if (alwaysSunday){                              //Error! Operator bool() not defined for Day.
    std::cout << "Sunday morning is everyday for all I care." << std::endl;   //Always executed.
} else{
    //never gets executed :/
}
{% endhighlight %}

Phew. No slip-ups now.

{% highlight cpp %}
enum class Color { Red, Green, Blue };
enum class Mood : unsigned int  { Angry, Blue, Churlish, Depressed, Euphoric = 0xFFFF0000 };      //Cool :)
{% endhighlight %}

Perfect. One last problem. How would you use enums as flgas?

Defining a struct enum_flagTraits that is a false type (enum_flagTriats<T>::value is false).
{% highlight cpp %}
template< class enum_t >
struct enum_flagTraits : std::false_type{
};
{% endhighlight %}

Defining an operator on this type looks like:
{% highlight cpp %}
//Bitwise OR
template< class enum_t >
typename std::enable_if<enum_flagTraits<enum_t>::value, enum_t>::type operator |(enum_t lhs, enum_t rhs){
	using underlyingType = typename std::underlying_type<enum_t>::type;
	return static_cast<enum_t>(static_cast<underlyingType>(lhs) | static_cast<underlyingType>(rhs));
}
{% endhighlight %}

Essentially, what we want is, the defined operator should work for certain 'special' types and fail for all others. We specifiy this using `std::enable_if`. `std::enable_if` will allow template generation for a type `enum_t` if `enum_flagTraits<enum_t>::value` is true. The second parameter of `std::enable_if` is simply typedef'd to `type`. So `std::enable_if<enum_flagTraits<enum_t>::value, enum_t>::type` will succeed if `enum_flagTraits<>` is specialised to be of true type for `enum_t` and will return `enum_t` as it's `::type`. Good, this gives us exactly what we needed.

To perform bit wise integral operations, we `static_cast` the operands to thier underlying type (assuming it is integral. Perhaps, you should check `std::is_integral<enum_t>::value`), perform the operation, cast back to the original `enum_t` type and return.

More operators would look similar.
{% highlight cpp %}
//Bitwise Flip
template< class enum_t >
typename std::enable_if<enum_flagTraits<enum_t>::value, enum_t>::type operator ~(enum_t rhs){
	return static_cast<enum_t>(~static_cast<typename std::underlying_type<enum_t>::type>(rhs));
}

//Bitwise |=
template< class enum_t >
typename std::enable_if<enum_flagTraits<enum_t>::value, enum_t>::type& operator |=(enum_t& lhs, enum_t rhs){
	return lhs = lhs | rhs;
}
{% endhighlight %}

Perfect. Let's put this to some use now.

{% highlight cpp %}

enum class Day{
    Monday,
    Tuesday,
    Wednesday,
    Thursday,
    Friday,
    Saturday,
    Sunday
};

Day today = Day::Monday;
if(today){                      //Error! cool.
    today += Day::Tuesday;      //Error! cool.
}

//Example from an actual production project I work on.
enum class FocusReason{
	None	= 0 << 0,
	Spatial	= 1 << 0,			//!< Focus was moved using spatial navigation.
	Guided	= 1 << 1,			//!< Focus was guided using a FocusGuide.
	User	= 1 << 2,			//!< Focus was set by client code.
	Text	= 1 << 3,			//!< Focus was set by text file specification.
	Other	= 1 << 4,			//!< Focus used other mechanism (programmed graphs, properties, et cetera).
	All = Spatial | Guided | User | Text | Other
};

//! Template specialization for FocusReason. This allows FocusReason to use enum_flagTraits.
template<>
struct enum_flagTraits<FocusReason> : std::true_type{};


FocusReason reason = FocusReason::Guided | FocusReason::Text;       //cool.
someRelevantMethod(reason);
...
...
void someRelevantMethod(FocusReason reason){
    if(reason & FocusReason::Guided && reason & FocusReason::Text){ //cool.
        std::cout << "The focus move was guided using a text config file rule." << std::endl;
    }
}

{% endhighlight %}


Scoped enums are awesome. You could now setup stronger guarantees by failing compile time if something is wrong - using `static_assert`. As the name suggests, this a compile time assert.

{% highlight cpp %}

template< class T >
struct focusguide_traits : public std::false_type{
	const T* m_object;
	std::pair<mt::float32, mt::float32> getPosition(){
		static_assert(this->value, "FocusFramework::focusguide_traits : You need to specialize focusguide_traits and implement getPosition() for your type!");
		return std::make_pair(0.0f, 0.0f);          //You won't really get here, but this makes the compiler happy :)
	}
};

template < class T >
class FocusGuide: public focusguide_traits<T> ... {
    ...
};


{% endhighlight %}

Here, a non specialized type, for example `someCrazyType`, would fail compile type when you try to instantiate `FocusGuide< someCrazyType >`.










