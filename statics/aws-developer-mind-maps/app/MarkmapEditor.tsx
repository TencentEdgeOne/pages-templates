'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Markmap } from 'markmap-view';
import { Transformer } from 'markmap-lib';

const MarkmapEditor = () => {
  const [markdown, setMarkdown] = useState(`# AWS for Web Developers

## Compute
- EC2 (Elastic Compute Cloud)
  - Virtual servers in the cloud
  - Scalable compute capacity
- Lambda
  - Serverless compute
  - Run code without provisioning servers
- Elastic Beanstalk
  - PaaS for easy deployment and scaling

## Storage
- S3 (Simple Storage Service)
  - Object storage
  - Highly scalable and durable
- EBS (Elastic Block Store)
  - Persistent block storage for EC2 instances
- EFS (Elastic File System)
  - Scalable file storage for EC2 instances

## Database
- RDS (Relational Database Service)
  - Managed relational databases
  - Supports multiple database engines
- DynamoDB
  - Managed NoSQL database
  - Fast and flexible
- ElastiCache
  - In-memory data store and cache

## Networking
- VPC (Virtual Private Cloud)
  - Isolated cloud resources
  - Configure network settings
- Route 53
  - DNS web service
  - Domain registration
- CloudFront
  - Content Delivery Network (CDN)
  - Low-latency content delivery

## Developer Tools
- CodeCommit
  - Managed source control service
- CodeBuild
  - Compile, test, and package code
- CodeDeploy
  - Automate code deployments
- CodePipeline
  - Continuous delivery service

## Security and Identity
- IAM (Identity and Access Management)
  - Manage user access and permissions
- Cognito
  - Add user sign-up and sign-in to apps
- WAF (Web Application Firewall)
  - Protect web applications from attacks

## Monitoring and Management
- CloudWatch
  - Monitor resources and applications
- CloudTrail
  - Track user activity and API usage
- X-Ray
  - Analyze and debug applications

## Application Integration
- SQS (Simple Queue Service)
  - Managed message queues
- SNS (Simple Notification Service)
  - Pub/sub messaging and mobile notifications
- API Gateway
  - Create, publish, and manage APIs

## AI and Machine Learning
- Rekognition
  - Image and video analysis
- Lex
  - Conversational interfaces and chatbots
- SageMaker
  - Build, train, and deploy ML models`);
  const svgRef = useRef<SVGSVGElement>(null);
  const markmapRef = useRef<Markmap | null>(null);

  useEffect(() => {
    const loadMarkmapLibs = async () => {
      const { Markmap } = await import('markmap-view');

      if (svgRef.current && !markmapRef.current) {
        markmapRef.current = Markmap.create(svgRef.current);
        // Initial render
        const transformer = new Transformer();
        const { root, features } = transformer.transform(markdown);
        markmapRef.current.setData(root);
        markmapRef.current.setOptions({
          ...markmapRef.current.options,
          ...features,
        });
        markmapRef.current.fit();
      }
    };

    loadMarkmapLibs();
  }, []);

  useEffect(() => {
    if (markmapRef.current) {
      const transformer = new Transformer();
      const { root, features } = transformer.transform(markdown);
      markmapRef.current.setData(root);
      markmapRef.current.setOptions({
        ...markmapRef.current.options,
        ...features,
      });
      markmapRef.current.fit();
    }
  }, [markdown]);

  return (
    <div className="flex h-[75vh] bg-gray-100">
      <div className="w-2/3 p-4 bg-white shadow-md">
        <svg ref={svgRef} className="w-full h-full"></svg>
      </div>
      <div className="w-1/3 p-4">
        <textarea
          className="w-full h-full p-4 border border-gray-300 rounded-lg shadow-inner resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
          placeholder="Write your markdown here..."
        />
      </div>
    </div>
  );
};

export default MarkmapEditor;
