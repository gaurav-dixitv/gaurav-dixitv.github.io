---
layout: post
title:  "writing a trivial neural network in c++"
date:   2017-5-5 00:00:00 +0530
categories: nn
excerpt: "let the back propogation begin."
comments: true

loadScripts: false
scripts: []
---

A simple Neuron would look like

{% highlight cpp %}
class Neuron{

    public:
        Neuron(unsigned numOutputs, unsigned index);

        void    setOutputValue(double value){mOutputValue = value;}
        double  outputValue()const {return mOutputValue;}

        void    feedForward(Layer& previousLayer);

        std::vector<Connection>& outputWeights() {return mOutputWeights;}

    private:
        double mOutputValue;
        unsigned mIndex;
        std::vector<Connection> mOutputWeights;

};
{% endhighlight %}

Where,

{% highlight cpp %}
Neuron::Neuron(unsigned numOutputs, unsigned index){
    mIndex = index;
    for (int c = 0; c < numOutputs; c++)
        mOutputWeights.push_back(Connection(NNUtils::randomWeight()));
}

void Neuron::feedForward(Layer& previousLayer){
    double sum = 0.0;
    for (unsigned n = 0; n < previousLayer.size(); ++n)
        sum += previousLayer[n].outputValue()*previousLayer[n].outputWeights()[mIndex].weight;
    mOutputValue = NNUtils::activationFunction(sum);
}
{% endhighlight %}


{% highlight cpp %}
class NeuralNet{
    public:
        NeuralNet(const std::vector<unsigned>& topology);

        void feedForward(const std::vector<double>& input);
        void backProp(const std::vector<double>& target);
        void getResults(std::vector<double>& result) const;

        double error() const { return mError; }
        double rms(const std::vector<double>& output);

    private:
        void updateWeights();

        std::vector<Layer> mLayers;
        double mError;
};
{% endhighlight %}


{% highlight cpp %}
double NeuralNet::rms(const std::vector<double>& output){

    Layer& outputLayer = mLayers.back();
    double error = 0.0;
    for (unsigned n = 0; n < outputLayer.size(); ++n){
        double del = output[n] - outputLayer[n].outputValue();
        error += (del*del);
    }
    error /= outputLayer.size();
    error = sqrt(error);
    return error;
}

void NeuralNet::getResults(std::vector<double>& result) const{
    result.clear();
    for (unsigned n = 0; n < mLayers.back().size(); ++n)
        result.push_back(mLayers.back()[n].outputValue());
}

void NeuralNet::backProp(const std::vector<double>& target){

    //calculate delta for all neurons
    Layer& outputLayer = mLayers.back();

    for (unsigned i = 0; i < outputLayer.size(); ++i){
        outputLayer[i].setDelta(target[i]-outputLayer[i].outputValue());
    }
    for (size_t layer = mLayers.size() - 2; layer>0; layer--){
        Layer& nextLayer = mLayers[layer + 1];
        for (size_t n = 0; n < mLayers[layer].size(); n++){
            mLayers[layer][n].calculateDelta(nextLayer);
        }
    }
    //now update all weights
    updateWeights();
}

void NeuralNet::updateWeights(){
    for (unsigned layer = 0; layer < mLayers.size() - 1; layer++){
        for (unsigned n = 0; n < mLayers[layer].size(); n++){
            Layer& nextLayer = mLayers[layer + 1];
            for (unsigned i = 0; i < mLayers[layer][n].outputWeights().size(); i++)
            {
                mLayers[layer][n].outputWeights()[i].weight +=
                        nextLayer[i].delta()
                        * mLayers[layer][n].outputValue()
                        * NNUtils::activationFunctionDerivative(nextLayer[i].outputValue())
                        * NNUtils::learningRate;

            }
        }
    }
}

void NeuralNet::feedForward(const std::vector<double>& input){
    //insert inputvalues in layer[0]
    for (unsigned i = 0; i < input.size(); ++i){
        mLayers[0][i].setOutputValue(input[i]);
    }
    for (unsigned layer = 1; layer < mLayers.size(); ++layer)
    {
        Layer& previousLayer = mLayers[layer - 1];
        Layer& currentLayer = mLayers[layer];
        for (unsigned n = 0; n < currentLayer.size(); ++n){
            currentLayer[n].feedForward(previousLayer);
        }
    }
}
{% endhighlight %}

Topology 2(input) units - 4 (hidden) units - 1 (output) units.
![iterations vs error]({{ "/assets/images/nn_xor/XOR2-4-1.png" | absolute_url }})

Perceptron.
![iterations vs error]({{ "/assets/images/nn_xor/XOR2-1-1.png" | absolute_url }})

Topology 2(input) units - 100 (hidden) units - 1 (output) units.
![iterations vs error]({{ "/assets/images/nn_xor/XOR2-100-1.png" | absolute_url }})