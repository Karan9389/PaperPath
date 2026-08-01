import paperModel from '../models/paper.js';

export const STANDARD_PAPERS = [
  {
    _id: 'standard-paper-1',
    title: 'Attention Is All You Need',
    authors: 'Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit, Llion Jones, Aidan N. Gomez, Łukasz Kaiser, Illia Polosukhin',
    category: 'Artificial Intelligence',
    difficulty: 'advanced',
    difficultyLevel: 'Advanced',
    tags: ['AI', 'Transformers', 'Deep Learning', 'NLP'],
    abstract: 'The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. We propose the Transformer, a model architecture based solely on attention mechanisms, dispensing with recurrence and convolutions entirely. Experiments on machine translation tasks show these models to be superior in quality while being more parallelizable and requiring significantly less time to train.',
    content: `1. Introduction
Recurrent neural networks (RNN), particularly long short-term memory (LSTM) and gated recurrent (GRU) neural networks, have been firmly established as state-of-the-art approaches in sequence modeling and transduction problems such as language modeling and machine translation. However, the sequential nature of RNNs precludes parallelization within training examples, which becomes critical at longer sequence lengths.

2. Background & Motivation
The goal of reducing sequential computation also forms the foundation of the Extended Neural GPU, ByteNet, and ConvS2S, all of which use convolutional neural networks as basic building blocks. In these models, the number of operations required to relate signals from two arbitrary input or output positions grows in the distance between positions. In the Transformer, this is reduced to a constant number of operations.

3. Architecture: Attention Mechanism
An attention function can be described as mapping a query and a set of key-value pairs to an output, where the query, keys, values, and output are all vectors. The output is computed as a weighted sum of the values, where the weight assigned to each value is computed by a compatibility function of the query with the corresponding key.

3.1 Scaled Dot-Product Attention
We call our particular attention "Scaled Dot-Product Attention". The input consists of queries and keys of dimension dk, and values of dimension dv. We compute the dot products of the query with all keys, divide each by sqrt(dk), and apply a softmax function to obtain the weights on the values.

Attention(Q, K, V) = softmax((Q * K^T) / sqrt(dk)) * V

3.2 Multi-Head Attention
Instead of performing a single attention function with d_model-dimensional keys, values and queries, we found it beneficial to linearly project the queries, keys and values h times with different, learned linear projections. On each of these projected versions of queries, keys and values we then perform the attention function in parallel.

4. Why Self-Attention
Self-attention, sometimes called intra-attention, is an attention mechanism relating different positions of a single sequence in order to compute a representation of the sequence. We compare self-attention layers to recurrent and convolutional layers in terms of computational complexity per layer, amount of computation that can be parallelized, and path length between long-range dependencies.

5. Conclusion
In this work, we presented the Transformer, the first sequence transduction model based entirely on attention, replacing the recurrent layers most commonly used in encoder-decoder architectures with multi-headed self-attention.`
  },
  {
    _id: 'standard-paper-2',
    title: 'BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding',
    authors: 'Jacob Devlin, Ming-Wei Chang, Kenton Lee, Kristina Toutanova (Google AI Language)',
    category: 'Natural Language Processing',
    difficulty: 'intermediate',
    difficultyLevel: 'Intermediate',
    tags: ['BERT', 'NLP', 'Language Models', 'Transformers'],
    abstract: 'We introduce a new language representation model called BERT, which stands for Bidirectional Encoder Representations from Transformers. Unlike recent language representation models, BERT is designed to pre-train deep bidirectional representations from unlabeled text by jointly conditioning on both left and right context in all layers. As a result, the pre-trained BERT model can be fine-tuned with just one additional output layer.',
    content: `1. Introduction
Language model pre-training has been shown to be effective for improving many natural language processing tasks. Existing strategies for applying pre-trained language representations to downstream tasks fall into two categories: feature-based (e.g., ELMo) and fine-tuning (e.g., OpenAI GPT).

2. BERT Model Architecture
BERT's model architecture is a multi-layer bidirectional Transformer encoder based on the original implementation described in Vaswani et al. (2017). We denote the number of layers (i.e., Transformer blocks) as L, the hidden size as H, and the number of self-attention heads as A.

3. Pre-training Tasks
Unlike left-to-right LMs, BERT uses two novel unsupervised prediction tasks:

3.1 Masked Language Model (MLM)
In order to train a deep bidirectional representation, we simply mask some percentage of the input tokens at random, and then predict those masked tokens. We refer to this procedure as a "Masked LM" (MLM).

3.2 Next Sentence Prediction (NSP)
Many important downstream tasks such as Question Answering (QA) and Natural Language Inference (NLI) are based on understanding the relationship between two sentences. In order to train a model that understands sentence relationships, we pre-train for a binarized next sentence prediction task.

4. Fine-Tuning BERT
Fine-tuning is straightforward because the self-attention mechanism in the Transformer allows BERT to model many downstream tasks—whether they involve single text or text pairs—by swapping out the appropriate inputs and outputs.

5. Results & Conclusion
BERT obtains state-of-the-art results on eleven natural language processing tasks, including GLUE, SQuAD v1.1, and SQuAD v2.0.`
  },
  {
    _id: 'standard-paper-3',
    title: 'Generative Adversarial Networks (GANs)',
    authors: 'Ian Goodfellow, Jean Pouget-Abadie, Mehdi Mirza, Bing Xu, David Warde-Farley, Yoshua Bengio',
    category: 'Generative AI',
    difficulty: 'intermediate',
    difficultyLevel: 'Intermediate',
    tags: ['GANs', 'Generative AI', 'Deep Learning', 'Computer Vision'],
    abstract: 'We propose a new framework for estimating generative models via an adversarial process, in which we simultaneously train two models: a generative model G that captures the data distribution, and a discriminative model D that estimates the probability that a sample came from the training data rather than G. The training procedure for G is to maximize the probability of D making a mistake.',
    content: `1. Introduction
The promise of deep learning is to discover rich, hierarchical models that represent probability distributions over the types of data encountered in artificial intelligence applications. To date, the most striking successes in deep learning have involved discriminative models.

2. Adversarial Nets
The adversarial modeling framework is most straightforward to apply when the models are both multilayer perceptrons. To learn the generator's distribution p_g over data x, we define a prior on input noise variables p_z(z), then represent a mapping to data space as G(z; theta_g).

3. The Minimax Game
D and G play the following two-player minimax game with value function V(D, G):

min_G max_D V(D, G) = E_x[log D(x)] + E_z[log(1 - D(G(z)))]

In practice, this formula provides sufficient gradient for G to learn early in training when D can easily reject samples.

4. Theoretical Results & Advantages
The generator G implicitly defines a probability distribution p_g. The global minimum of the virtual training criterion is achieved if and only if p_g = p_data. Advantages include: no Markov chains needed, backpropagation for gradients, and flexible function representations.

5. Conclusion
Adversarial nets open new pathways for unsupervised generative learning and high-fidelity synthetic media creation.`
  },
  {
    _id: 'standard-paper-4',
    title: 'Deep Residual Learning for Image Recognition (ResNet)',
    authors: 'Kaiming He, Xiangyu Zhang, Shaoqing Ren, Jian Sun (Microsoft Research)',
    category: 'Computer Vision',
    difficulty: 'intermediate',
    difficultyLevel: 'Intermediate',
    tags: ['Computer Vision', 'ResNet', 'Convolutional Networks', 'ImageNet'],
    abstract: 'Deeper neural networks are more difficult to train. We present a residual learning framework to ease the training of networks that are substantially deeper than those previously used. We explicitly reformulate the layers as learning residual functions with reference to the layer inputs, instead of learning unreferenced functions.',
    content: `1. Introduction
Deep convolutional neural networks have led to a series of breakthroughs for image classification. Driven by the significance of depth, a question arises: Is learning better networks as easy as stacking more layers? Vanishing/exploding gradients hampers convergence from the onset.

2. Deep Residual Learning Framework
Instead of expecting stacked layers to fit a desired underlying mapping H(x), we explicitly let these layers fit a residual mapping F(x) := H(x) - x. The original mapping is recast into F(x) + x.

Shortcut Formulation: y = F(x, {W_i}) + x

3. Empirical Evaluation
On ImageNet, ResNet-152 achieves 3.57% error, winning 1st place in the ILSVRC 2015 classification competition. Our residual networks scale effectively to over 1000 layers.

4. Conclusion
Residual learning solves the degradation problem in ultra-deep neural networks and provides a standard backbone for visual recognition.`
  },
  {
    _id: 'standard-paper-5',
    title: 'Introduction to Photosynthesis & Plant Energy Conversion',
    authors: 'Dr. Elena Rostova & Prof. Marcus Vance',
    category: 'Biology',
    difficulty: 'beginner',
    difficultyLevel: 'Beginner',
    tags: ['Biology', 'Photosynthesis', 'Plant Science', 'Foundations'],
    abstract: 'Photosynthesis is the fundamental biological process through which plants, algae, and certain bacteria convert light energy into chemical energy. This foundational paper explains the two main stages of photosynthesis: light-dependent reactions in thylakoid membranes and the Calvin cycle in stroma.',
    content: `1. Introduction
Photosynthesis is essential to all life on Earth. It is the primary source of organic matter for almost all organisms and provides the oxygen required for aerobic respiration.

2. Overview of Photosynthesis
The overall chemical equation for oxygenic photosynthesis is:

6 CO2 + 6 H2O + Light Energy -> C6H12O6 + 6 O2

3. The Light-Dependent Reactions
Light reactions take place in the thylakoid membranes inside chloroplasts. Chlorophyll molecules absorb photons of light, exciting electrons that travel down an electron transport chain. This process produces ATP and NADPH while splitting water molecules to release oxygen.

4. The Calvin Cycle (Light-Independent Reactions)
The Calvin cycle takes place in the stroma of the chloroplast. It uses ATP and NADPH produced during the light reactions to fix atmospheric carbon dioxide into 3-carbon sugar molecules (G3P), which eventually combine to form glucose.

5. Conclusion
Understanding photosynthesis is vital for agriculture, renewable bioenergy production, and combating climate change through carbon sequestration.`
  },
  {
    _id: 'standard-paper-6',
    title: 'PaperPath System & RAG Architecture Whitepaper',
    authors: 'Karan Kumar & Aditya Kumar',
    category: 'Platform Architecture',
    difficulty: 'beginner',
    difficultyLevel: 'Beginner',
    tags: ['PaperPath', 'RAG', 'AI Tutor', 'EdTech', 'Architecture'],
    abstract: 'PaperPath is an intelligent research paper navigation and learning platform built to bridge the gap between dense academic literature and student comprehension. Featuring automated PDF/CSV ingestion, semantic vector chunking, level-adjusted difficulty tagging, and an integrated Gemini AI tutor.',
    content: `1. Introduction & Executive Summary
Academic research papers are often written in dense, specialized jargon that presents a significant barrier to students and early-stage researchers. PaperPath is engineered to solve this problem by transforming complex papers into interactive, accessible learning experiences.

2. Core Features
- Level-Adjusted Curation: Papers are categorized into Beginner, Intermediate, and Advanced difficulty tiers.
- Interactive AI Tutor: Students can ask questions about any section of a paper and receive instant, simplified explanations.
- Smart PDF & CSV Ingestion: Automated ingestion engines chunk documents and extract key insights for search and indexing.
- Personal Library & History: Track reading history and bookmark key papers for quick reference.

3. RAG Architecture & AI Pipeline
PaperPath utilizes Retrieval-Augmented Generation (RAG). When a student asks a question about a paper:
1. The question is combined with the context of the active paper.
2. The context is routed to Google Gemini AI (or local LLM engines).
3. The AI generates a tailored, clear explanation suited for the student's level.

4. Vision for the Future
PaperPath aims to democratize academic knowledge worldwide by making research papers as easy to read as educational textbooks.`
  }
];

export const seedDefaultPapers = async () => {
  try {
    const existingCount = await paperModel.countDocuments();
    if (existingCount === 0) {
      console.log('🌱 Database has no papers. Seeding standard edition papers...');
      await paperModel.insertMany(STANDARD_PAPERS);
      console.log('✅ Successfully seeded standard edition papers into MongoDB!');
    }
  } catch (error) {
    console.error('⚠️ Warning: Failed to seed default papers into MongoDB:', error.message);
  }
};
